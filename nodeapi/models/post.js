const { Schema, model } = require('mongoose');

const {
  Types: { ObjectId },
} = Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
    created: {
      type: Date,
      default: Date.now(),
    },
    updated: Date,
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        created: {
          type: Date,
          default: Date.now(),
        },
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = model('Post', postSchema);
