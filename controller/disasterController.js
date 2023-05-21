import DisasterModel from "../model/disasterModel.js";
import axios from "axios";
import schedule from "node-schedule";

async function createDisasterRecords() {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format
    const response = await axios.get(
      "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH",
      {
        params: {
          fromdate: currentDate,
          todate: "2023-05-19",
          alertlevel: "reg;orange;green",
        },
      }
    );

    const disasters = response.data; // Assuming the API response is in JSON format and contains the list of disasters

    // Iterate over the disasters and create new records in the database
    for (const disaster of disasters) {
      const newDisaster = new DisasterModel({
        type: disaster.type,
        location: disaster.location,
        latitude: disaster.latitude,
        longitude: disaster.longitude,
        start_time: disaster.start_time,
        end_time: disaster.end_time,
        status: disaster.status,
      });

      await newDisaster.save();
    }

    console.log("Disaster records created successfully");
  } catch (error) {
    console.error("Failed to create disaster records:", error);
  }
}

// Call the function to create the disaster records
schedule.scheduleJob("0 0 * * *", createDisasterRecords);

export async function getAllDisasters(req, res) {
  try {
    let filters = {};

    // Apply filters
    const query = req.query.q;
    if (query) {
      const regex = new RegExp(query, "i");
      filters.$or = [
        { title: { $regex: regex } },
        { location: { $regex: regex } },
      ];
    }

    // Apply pagination options
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const options = {
      page,
      limit,
    };

    const disasters = await DisasterModel.paginate(filters, options);

    if (disasters.docs.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No disasters found" });
    }

    const disastersWithTime = disasters.docs.map((disaster) => {
      const { start_time, end_time } = disaster;
      const duration = calculateDuration(start_time, end_time);

      return {
        ...disaster.toObject(),
        start_time,
        end_time,
        duration,
      };
    });

    res.status(200).json({
      success: true,
      data: disastersWithTime,
      totalPages: disasters.totalPages,
      currentPage: disasters.page,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationInMillis = end - start;
  const durationInHours = durationInMillis / (1000 * 60 * 60);
  const roundedDuration = Math.round(durationInHours * 100) / 100;
  const durationWithUnit = roundedDuration + " hours";
  return durationWithUnit;
}

export async function createDisaster(req, res) {
  try {
    const disasterData = req.body;

    // Validate type and status values
    if (!isValidEnumValue(disasterData.type, ["EQ", "FL", "TC", "VO", "DR"])) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid disaster type" });
    }

    if (
      !isValidEnumValue(disasterData.status, [
        "Green",
        "Yellow",
        "Orange",
        "Red",
      ])
    ) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const disaster = new DisasterModel(disasterData);
    const createdDisaster = await disaster.save();

    res.status(201).json({ success: true, data: createdDisaster });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function getDisasterById(req, res) {
  try {
    const { id } = req.params;
    const disaster = await DisasterModel.findById(id);

    if (!disaster) {
      return res
        .status(404)
        .json({ success: false, error: "Disaster not found" });
    }

    res.status(200).json(disaster);
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
export async function updateDisaster(req, res) {
  try {
    const { id } = req.params;
    const disasterData = req.body;

    // Validate type and status values
    if (
      disasterData.type &&
      !isValidEnumValue(disasterData.type, ["EQ", "FL", "TC", "VO", "DR"])
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid disaster type" });
    }

    if (
      disasterData.status &&
      !isValidEnumValue(disasterData.status, [
        "Green",
        "Yellow",
        "Orange",
        "Red",
      ])
    ) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const updatedDisaster = await DisasterModel.findByIdAndUpdate(
      id,
      disasterData,
      { new: true }
    );

    if (!updatedDisaster) {
      return res
        .status(404)
        .json({ success: false, error: "Disaster not found" });
    }

    res.status(200).json({ success: true, data: updatedDisaster });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

// Helper function to check if a value is valid within the specified enum values
function isValidEnumValue(value, enumValues) {
  return enumValues.includes(value);
}

export async function deleteDisaster(req, res) {
  try {
    const { id } = req.params;
    const deletedDisaster = await DisasterModel.findByIdAndDelete(id);

    if (!deletedDisaster) {
      return res
        .status(404)
        .json({ success: false, error: "Disaster not found" });
    }

    res.status(200).json(deletedDisaster);
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
