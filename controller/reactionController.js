import ReactionModel from "../model/reactionModel.js";

export async function createReaction(req, res) {
  try {
    const { comment,name } = req.body;

    if (!comment || !name) {
      return res
        .status(400)
        .json({ success: false, error: "Comment or name is required" });
    }

    const reaction = new ReactionModel({ comment,name });
    const createdReaction = await reaction.save();

    res.status(201).json({ success: true, data: createdReaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
  
}

export async function getReactionById(req, res) {

  try {
    const { id } = req.params;
    const reaction = await ReactionModel.findById(id);

    if (!reaction) {
      return res
        .status(404)
        .json({ success: false, error: "Reaction not found" });
    }

    res.status(200).json({ success: true, data: reaction });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function updateReaction(req, res) {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res
        .status(400)
        .json({ success: false, error: "Comment is required" });
    }

    const updatedReaction = await ReactionModel.findByIdAndUpdate(
      id,
      { comment },
      { new: true }
    );

    if (!updatedReaction) {
      return res
        .status(404)
        .json({ success: false, error: "Reaction not found" });
    }

    res.status(200).json({ success: true, data: updatedReaction });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function deleteReaction(req, res) {
  try {
    const { id } = req.params;
    const deletedReaction = await ReactionModel.findByIdAndDelete(id);

    if (!deletedReaction) {
      return res
        .status(404)
        .json({ success: false, error: "Reaction not found" });
    }

    res.status(200).json({ success: true, data: deletedReaction });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function getAllReactions(req, res) {
  try {
    // const {limit}= 1;
    const limit = parseInt(req.query.limit)||10;

    const reactions = await ReactionModel.paginate({},{limit});

    if (reactions.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No reactions found" });
    }

    res.status(200).json({ success: true, data: reactions });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
