import PersonModel from "../model/personModel.js";
import DisasterModel from "../model/announcmentModel.js";
//DisasterModel
export async function getAllPersons(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const q = req.query.q;

    const query = { status: true };

    // Add search criteria to the query object if `q` is provided
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { colorSkin: q },
        { gender: q },
        { colorHair: q },
        { eyes: q },
      ];
    }
    const type = req.query.found;
    if (type) {
      query.found = type;
    }
    // Add more search criteria to the query object
    const additionalFilter1 = req.query.s;
    if (additionalFilter1) {
      query.additionalField1 = additionalFilter1;
    }

    const additionalFilter2 = req.query.r;
    if (additionalFilter2) {
      query.additionalField2 = additionalFilter2;
    }

    const lostCount = await PersonModel.countDocuments({
      status: true,
      found: "Lost",
    });
    const foundCount = await PersonModel.countDocuments({
      status: true,
      found: "found",
    });
    const options = { page, limit };

    const persons = await PersonModel.paginate(query, {
      page,
      limit,
      sort: { _id: -1 }, // Sort by _id field in descending order
    });
    if (persons.totalDocs === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No persons found" });
    }

    const personsWithDisasterIds = await Promise.all(
      persons.docs.map(async (person) => {
        const disasterIds = await DisasterModel.find({
          idPerson: person._id,
          report: false,
        })
          .distinct("_id")
          .exec();

        return {
          ...person.toObject(),
          disasterIds,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: personsWithDisasterIds,
      lostCount,
      foundCount,
      totalDocs: persons.totalDocs,
      limit: persons.limit,
      page: persons.page,
      totalPages: persons.totalPages,
      hasNextPage: persons.hasNextPage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
}

export async function getAll(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const q = req.query.q;

    const query = {};

    // Add search criteria to the query object if `q` is provided
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { colorSkin: q },
        { gender: q },
        { colorHair: q },
        { eyes: q },
      ];
    }
    const type = req.query.found;
    if (type) {
      query.found = type;
    }
    // Add more search criteria to the query object
    const additionalFilter1 = req.query.s;
    if (additionalFilter1) {
      query.additionalField1 = additionalFilter1;
    }

    const additionalFilter2 = req.query.r;
    if (additionalFilter2) {
      query.additionalField2 = additionalFilter2;
    }

    const lostCount = await PersonModel.countDocuments({
      status: true,
      found: "Lost",
    });
    const foundCount = await PersonModel.countDocuments({
      status: true,
      found: "found",
    });
    const options = { page, limit };

    const persons = await PersonModel.paginate(query, options);

    if (persons.totalDocs === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No persons found" });
    }

    const personsWithDisasterIds = await Promise.all(
      persons.docs.map(async (person) => {
        const disasterIds = await DisasterModel.find({
          idPerson: person._id,
          report: false,
        })
          .distinct("_id")
          .exec();

        return {
          ...person.toObject(),
          disasterIds,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: personsWithDisasterIds,
      lostCount,
      foundCount,
      totalDocs: persons.totalDocs,
      limit: persons.limit,
      page: persons.page,
      totalPages: persons.totalPages,
      hasNextPage: persons.hasNextPage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
}
export async function createPerson(req, res) {
  try {
    const person = new PersonModel(req.body);
    const createdPerson = await person.save();

    res.status(201).json({ success: true, data: createdPerson });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}

// Controller function to get a person by ID
export async function getPersonById(req, res) {
  try {
    const { id } = req.params;
    const person = await PersonModel.findById(id);

    if (!person) {
      return res
        .status(404)
        .json({ success: false, error: "Person not found" });
    }

    res.status(200).json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function updatePerson(req, res) {
  try {
    const { id } = req.params;
    const updatedPerson = await PersonModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPerson) {
      return res
        .status(404)
        .json({ success: false, error: "Person not found" });
    }

    res.status(200).json({ success: true, data: updatedPerson });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function deletePerson(req, res) {
  try {
    const { id } = req.params;
    const deletedPerson = await PersonModel.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res
        .status(404)
        .json({ success: false, error: "Person not found" });
    }

    res.status(200).json({ success: true, deletedPerson });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
