
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Doctor from "./Doctor.js";
import Service from "./Service.js";
import Speciality from "./Speciality.js";
import Banner from "./Banner.js";
import SocialPost from "./SocialPost.js";
import Settings from "./Settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(
  express.json({
    limit: "5mb",
  })
);

// BASIC
app.get("/", (req, res) => {
  res.json({ message: "Vedant Hospital Backend is running!" });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is connected successfully!",
  });
});

// GENERIC ERROR HANDLER
const handleError = (res, message, error, status = 500) => {
  res.status(status).json({
    message,
    error: error.message,
  });
};

// DOCTORS
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ order: 1 });
    res.json(doctors);
  } catch (error) {
    handleError(res, "Failed to fetch doctors", error);
  }
});

app.post("/api/doctors", async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    handleError(res, "Failed to add doctor", error, 400);
  }
});

app.put("/api/doctors/:id", async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(updatedDoctor);
  } catch (error) {
    handleError(res, "Failed to update doctor", error, 400);
  }
});

app.delete("/api/doctors/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    handleError(res, "Failed to delete doctor", error, 400);
  }
});

// SERVICES
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    handleError(res, "Failed to fetch services", error);
  }
});

app.post("/api/services", async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    handleError(res, "Failed to add service", error, 400);
  }
});

app.put("/api/services/:id", async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(updatedService);
  } catch (error) {
    handleError(res, "Failed to update service", error, 400);
  }
});

app.delete("/api/services/:id", async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    handleError(res, "Failed to delete service", error, 400);
  }
});

// SPECIALITIES
app.get("/api/specialities", async (req, res) => {
  try {
    const specialities = await Speciality.find().sort({ order: 1 });
    res.json(specialities);
  } catch (error) {
    handleError(res, "Failed to fetch specialities", error);
  }
});

app.post("/api/specialities", async (req, res) => {
  try {
    const speciality = new Speciality(req.body);
    const savedSpeciality = await speciality.save();
    res.status(201).json(savedSpeciality);
  } catch (error) {
    handleError(res, "Failed to add speciality", error, 400);
  }
});

app.put("/api/specialities/:id", async (req, res) => {
  try {
    const updatedSpeciality = await Speciality.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSpeciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    res.json(updatedSpeciality);
  } catch (error) {
    handleError(res, "Failed to update speciality", error, 400);
  }
});

app.delete("/api/specialities/:id", async (req, res) => {
  try {
    const deletedSpeciality = await Speciality.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSpeciality) {
      return res.status(404).json({ message: "Speciality not found" });
    }

    res.json({
      success: true,
      message: "Speciality deleted successfully",
    });
  } catch (error) {
    handleError(res, "Failed to delete speciality", error, 400);
  }
});

// BANNERS
app.get("/api/banners", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    handleError(res, "Failed to fetch banners", error);
  }
});

app.post("/api/banners", async (req, res) => {
  try {
    const banner = new Banner(req.body);
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    handleError(res, "Failed to add banner", error, 400);
  }
});

app.put("/api/banners/:id", async (req, res) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json(updatedBanner);
  } catch (error) {
    handleError(res, "Failed to update banner", error, 400);
  }
});

app.delete("/api/banners/:id", async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);

    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    handleError(res, "Failed to delete banner", error, 400);
  }
});

// SOCIAL POSTS
app.get("/api/social-posts", async (req, res) => {
  try {
    const posts = await SocialPost.find().sort({ order: 1 });
    res.json(posts);
  } catch (error) {
    handleError(res, "Failed to fetch social posts", error);
  }
});

app.post("/api/social-posts", async (req, res) => {
  try {
    const post = new SocialPost(req.body);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    handleError(res, "Failed to add social post", error, 400);
  }
});

app.put("/api/social-posts/:id", async (req, res) => {
  try {
    const updatedPost = await SocialPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Social post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    handleError(res, "Failed to update social post", error, 400);
  }
});

app.delete("/api/social-posts/:id", async (req, res) => {
  try {
    const deletedPost = await SocialPost.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Social post not found" });
    }

    res.json({
      success: true,
      message: "Social post deleted successfully",
    });
  } catch (error) {
    handleError(res, "Failed to delete social post", error, 400);
  }
});

// HOSPITAL SETTINGS
// One document stores the hospital's global settings.

app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    handleError(res, "Failed to fetch settings", error);
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: req.body },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(settings);
  } catch (error) {
    handleError(res, "Failed to update settings", error, 400);
  }
});

// START SERVER
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();