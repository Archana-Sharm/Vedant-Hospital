import mongoose from "mongoose";

const socialPostSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["facebook", "instagram", "youtube"],
      required: true,
    },

    postUrl: {
      type: String,
      default: "",
    },

    embedUrl: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const SocialPost = mongoose.model(
  "SocialPost",
  socialPostSchema
);

export default SocialPost;