import DisasterModel from "../model/disasterModel.js";

export async function getAllDisasters(req, res) {
  try {
    const disasters = await DisasterModel.paginate();

    if (disasters.length === 0) {
      return res.status(200).json("No disasters found");
    }

    res.status(200).json({ success: true, data: disasters });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function createDisaster(req, res) {
    try {
      const disasterData = req.body;
  
      // Validate type and status values
      if (!isValidEnumValue(disasterData.type, ["EQ", "FL", "TC", "VO", "DR"])) {
        return res.status(400).json({ success: false, error: "Invalid disaster type" });
      }
  
      if (!isValidEnumValue(disasterData.status, ["Green", "Yellow", "Orange", "Red"])) {
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
      if (disasterData.type && !isValidEnumValue(disasterData.type, ["EQ", "FL", "TC", "VO", "DR"])) {
        return res.status(400).json({ success: false, error: "Invalid disaster type" });
      }
  
      if (disasterData.status && !isValidEnumValue(disasterData.status, ["Green", "Yellow", "Orange", "Red"])) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }
  
      const updatedDisaster = await DisasterModel.findByIdAndUpdate(
        id,
        disasterData,
        { new: true }
      );
  
      if (!updatedDisaster) {
        return res.status(404).json({ success: false, error: "Disaster not found" });
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
