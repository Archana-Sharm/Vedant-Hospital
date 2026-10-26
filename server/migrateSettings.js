import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Settings from "./Settings.js";

dotenv.config();

const existingSettings = {
  name: "Vedant Multispeciality Hospital",

  tagline: "Comprehensive Healthcare. Compassionate Care.",

  phone: "+91 93250 39914",

  alternatePhone: "",

  email: "info@vedanthospital.com",

  address:
    "MQ6W+299, Sambhajinagar, Chinchwad, Pimpri-Chinchwad, Maharashtra 411019",

  mapsLink:
    "https://maps.google.com/?q=Vedant+Multispeciality+Hospital+Chinchwad",

  emergencyContact: "+91 93250 39914",

  workingHours: "Open 24 Hours",

  whatsapp: "+919325039914",

  facebook: "https://facebook.com",

  instagram: "https://instagram.com",

  youtube: "https://youtube.com",

  logo: "",
};

// ============================================================
// READ EXISTING HOSPITAL LOGO
// ============================================================

function loadHospitalLogo() {
  try {
    // Logo is directly inside:
    // Vedant-Hospital/assets/

    const projectRoot = path.resolve(process.cwd(), "..");

    const logoPath = path.join(
      projectRoot,
      "assets",
      "Vedant Multi Specialty Hospital Logo.png"
    );

    console.log("Looking for logo at:");
    console.log(logoPath);

    if (!fs.existsSync(logoPath)) {
      console.log("Hospital logo file not found.");
      return "";
    }

    const imageBuffer = fs.readFileSync(logoPath);

    const base64Image = imageBuffer.toString("base64");

    console.log("Hospital logo found successfully.");

    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.log("Could not read hospital logo:", error.message);
    return "";
  }
}

// ============================================================
// MIGRATE SETTINGS
// ============================================================

async function migrateSettings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const logo = loadHospitalLogo();

    const settingsToSave = {
      ...existingSettings,
    };

    if (logo) {
      settingsToSave.logo = logo;
    }

    const existingDocument = await Settings.findOne();

    if (existingDocument) {
      await Settings.findByIdAndUpdate(
        existingDocument._id,
        {
          $set: settingsToSave,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      console.log("Existing Settings document updated.");
    } else {
      await Settings.create(settingsToSave);

      console.log("Settings document created from existing hospital data.");
    }

    console.log("");
    console.log("====================================");
    console.log("Settings migration completed");
    console.log("====================================");
    console.log("");

    console.log("Hospital:", existingSettings.name);
    console.log("Phone:", existingSettings.phone);
    console.log("Email:", existingSettings.email);
    console.log("Emergency:", existingSettings.emergencyContact);
    console.log("Working Hours:", existingSettings.workingHours);
    console.log(
      "Logo:",
      logo ? "Migrated successfully" : "Not migrated"
    );

    console.log("");
  } catch (error) {
    console.error("Settings migration failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

migrateSettings();