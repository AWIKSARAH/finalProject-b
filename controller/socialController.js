import SocialModel from "../model/socialMedia.js";

export async function createSocial(req, res) {
  try {
    const { name, url } = req.body;

    const socialMedia = new SocialModel({
      name,
      url,
    });

    const savedSocialMedia = await socialMedia.save();

    res.status(200).json(savedSocialMedia);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ error: errors });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
}
export async function getAllSocials(req, res) {
  try {
    const socials = await SocialModel.find();
    socials.length === 0
      ? res.status(200).json({message:"Empty social"})
      : res.status(200).json(socials);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getSocialById(req, res) {
  try {
    const { id } = req.params;
    const social = await SocialModel.findById(id);

    if (!social) {
      return res.status(404).json({ error: "Social media entry not found" });
    }

    res.status(200).json(social);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateSocial(req, res) {
  try {
    const { id } = req.params;
    const { name, url } = req.body;

    const updatedSocial = await SocialModel.findByIdAndUpdate(
      id,
      { name, url },
      { new: true }
    );

    if (!updatedSocial) {
      return res.status(404).json({ error: "Social media entry not found" });
    }

    res.status(200).json(updatedSocial);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ error: errors });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
}

export async function deleteSocial(req, res) {
  try {
    const { id } = req.params;

    const deletedSocial = await SocialModel.findByIdAndDelete(id);

    if (!deletedSocial) {
      return res.status(404).json({ error: "Social media entry not found" });
    }

    res
      .status(200)
      .json({ message: "Social media entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
