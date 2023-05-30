import AnnouncementModel from "../model/announcmentModel.js";
import PersonModel from "../model/personModel.js";
import mongoose from "mongoose";
export async function getAllAnnouncements(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let filters = { report: false };
    let filtersPerson = {};
    const query = req.query.q;
    const person = req.query.p;

    if (query) {
      const regex = new RegExp(query, "i");
      filters.$or = [
        { title: { $regex: regex } },
        { country: { $regex: regex } },
        { tel: { $regex: regex } },
      ];
    }

    const lostCount = await AnnouncementModel.countDocuments({
      report: false,
      type: "lost",
    });
    const foundCount = await AnnouncementModel.countDocuments({
      report: false,
      type: "find",
    });
    const type = req.query.type;
    if (type) {
      filters.type = type;
    }

    // Add other filters as needed...

    const announcements = await AnnouncementModel.paginate(filters, {
      page,
      limit,
    });

    if (person) {
      const regex = new RegExp(person, "i");
      filtersPerson.$or = [
        { name: { $regex: regex } },
        { colorHair: { $regex: regex } },
        { gender: { $regex: regex } },
        { colorSkin: { $regex: regex } },
        { eyes: { $regex: regex } },
      ];
    }

    const persons = await PersonModel.paginate(filtersPerson);

    if (announcements.docs.length === 0 && persons.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No announcements or persons found" });
    }

    const announcementsWithTotalComments = announcements.docs.map(
      (announcement) => {
        const totalComments = announcement.reactionId.length;
        return { ...announcement.toObject(), totalComments };
      }
    );
    const total = lostCount + foundCount;
    res.status(200).json({
      success: true,
      data: announcementsWithTotalComments,
      persons,
      totalPages: announcements.totalPages,
      currentPage: announcements.page,
      lostCount,
      foundCount,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const addReaction = async (req, res) => {
  try {
    const { reactionId } = req.body;
    const announcementId = req.params.id;
    console.log(announcementId);
    // Find the announcement by ID
    const announcement = await AnnouncementModel.findById(announcementId);

    // If the announcement doesn't exist, return an error
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    // Check if the comment already exists in the reactionId array
    const commentExists = announcement.reactionId.some((id) =>
      id.equals(reactionId)
    );

    if (commentExists) {
      return res.status(400).json({ error: "Comment already exists" });
    }
    announcement.reactionId.push(reactionId);

    // Save the updated announcement
    await announcement.save();

    // Return the updated announcement
    return res.status(200).json({ announcement });
  } catch (error) {
    console.error("Error adding reaction to announcement:", error);
    return res.status(500).json({ error: error });
  }
};

export async function getAllReport(req, res) {
  try {
    let filters = { report: true };
    const query = req.query.q;

    if (query) {
      const regex = new RegExp(query, "i");
      filters.$or = [
        { title: { $regex: regex } },
        { "idPerson.name": { $regex: regex } },
        { "idPerson.dob": { $regex: regex } },
        { "idPerson.gender": { $regex: regex } },
        { "idPerson.relationship": { $regex: regex } },
      ];
    }

    const type = req.query.type;
    if (type) {
      filters.type = type;
    }

    // Add other filters as needed...

    const announcements = await AnnouncementModel.paginate(filters);

    if (announcements.docs.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No announcements found" });
    }

    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}

export const updateConfirmationById = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await AnnouncementModel.findByIdAndUpdate(eventId, {
      report: req.body.report,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Update the status of the associated person
    if (req.body.report === true) {
      await PersonModel.findByIdAndUpdate(event.idPerson, { status: true });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export async function createAnnouncement(req, res) {
  try {
    console.log(req.body);
    const createdAnnouncement = await AnnouncementModel.create(req.body);
    console.log("test");
    res.status(201).json({ success: true, data: createdAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getAnnouncementById(req, res) {
  try {
    const { id } = req.params;
    const announcement = await AnnouncementModel.findById(id)
      .populate("idPerson")
      .populate("idDisaster")
      .exec();

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, error: "Announcement not found" });
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}
export async function updateAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res
        .status(404)
        .json({ success: false, error: "Announcement not found" });
    }

    if (updatedAnnouncement.isModified === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No changes were made" });
    }

    res.status(200).json({ success: true, data: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res
        .status(404)
        .json({ success: false, error: "Announcement not found" });
    }

    res.status(200).json({ success: true, data: deletedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
