
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      default: "",
      trim: true,
    },

    qualification: {
      type: String,
      default: "",
    },

    specialization: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    timing: {
      type: String,
      default: "",
    },

    fees: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    photo: {
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

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
