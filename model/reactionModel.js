import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const reactionSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true,'You Can\'t post a empty comment'],
  },
  name: {
    type:String,
    required: [true,'put your name please !']
  }
});

reactionSchema.plugin(mongoosePaginate);

const ReactionModel = mongoose.model('Reaction', reactionSchema);

export default ReactionModel;
