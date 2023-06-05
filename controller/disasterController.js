import DisasterModel from "../model/disasterModel.js";
import axios from "axios";
// import schedule from "node-schedule";

export async function createDisasterRecords(req, res, next) {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format
    const response = await axios.get(
      "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH",
      {
        params: {
          fromdate: "2022-05-13",
          todate: currentDate,
          alertlevel: "reg;orange;green",
        },
      }
    );
    const events = response.data.features.map((event) => {
      const title = event.properties.name;
      const eventId = event.properties.eventid;
      const location = event.properties.country;
      const latitude = event.geometry.coordinates[1];
      const longitude = event.geometry.coordinates[0];
      const status = event.properties.alertlevel;
      const start_time = event.properties.fromdate;
      const end_time = event.properties.todate;
      const url = event.properties.url.report;
      const type = event.properties.eventtype;
      return {
        title,
        status,
        eventId,
        location,
        latitude,
        start_time,
        end_time,
        url,
        type,
        longitude,
      };
    });

    for (const event of events) {
      const existingDisaster = await DisasterModel.findOne({
        eventId: event.eventId,
      });

      if (existingDisaster) {
        console.log(
          `Disaster with event ID ${event.eventId} already exists. Skipping...`
        );
        return res.status(200).json({
          success: false,
          message: `Disaster with event ID ${event.eventId} already exists`,
        });
      }

      const newDisaster = new DisasterModel(event);
      await newDisaster.save();
    }

    return res.status(200).json({
      success: true,
      message: "Disaster records created successfully",
    });
  } catch (error) {
    console.error("Failed to create disaster records:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create disaster records",
    });
  }
}

// Call the function to create the disaster records
// schedule.scheduleJob("0 0 * * *", createDisasterRecords);

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

    const disasters = await DisasterModel.find(filters);

    if (disasters.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No disasters found" });
    }

    const disastersWithTime = disasters.map((disaster) => {
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
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
