import PersonModel from "../model/personModel.js";
import DisasterModel from "../model/disasterModel.js";
import AnnouncementModel from "../model/announcmentModel.js";
export const searchAll = async (req, res) => {
  const { q } = req.query;

  // Check if q parameter is missing or null
  if (!q) {
    return res.status(400).json({ message: "Missing search query" });
  }

  try {
    // Perform the search query
    const persons = await PersonModel.find({ $text: { $search: q } });
    const disasters = await DisasterModel.find({ $text: { $search: q } });
    const announcements = await AnnouncementModel.find({
      $text: { $search: q },
    });

    res.json({ persons, disasters, announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
