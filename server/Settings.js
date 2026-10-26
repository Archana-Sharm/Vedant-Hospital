import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    tagline: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    alternatePhone: {
      type: String,
      default: "",
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    workingHours: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    mapsLink: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model(
  "Settings",
  settingsSchema
);

export default Settings;