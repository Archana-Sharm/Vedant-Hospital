import mongoose from "mongoose";
import dotenv from "dotenv";
import Banner from "./Banner.js";

dotenv.config();

const banners = [
  {
    title: "Comprehensive Healthcare. Compassionate Care.",
    subtitle:
      "Vedant Multispeciality Hospital provides comprehensive medical, surgical, diagnostic, emergency and critical-care services under one roof in Chinchwad, Pimpri-Chinchwad.",
    buttonText: "Book Appointment",
    buttonLink: "/contact",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop&auto=format",
    active: true,
    order: 1,
  },

  {
    title: "24/7 Emergency & Trauma Care",
    subtitle:
      "Our casualty department, ICU, HDU and specialist teams are available around the clock for medical emergencies and trauma cases.",
    buttonText: "Emergency: +91 93250 39914",
    buttonLink: "/contact",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&h=900&fit=crop&auto=format",
    active: true,
    order: 2,
  },

  {
    title: "Super-Speciality Medical Services",
    subtitle:
      "From Cardiology to Neurosurgery, Oncology to Nephrology — our specialists bring advanced care to Pimpri-Chinchwad.",
    buttonText: "Explore Services",
    buttonLink: "/services",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop&auto=format",
    active: true,
    order: 3,
  },
];

async function migrateBanners() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Prevent duplicate migration
    await Banner.deleteMany({});

    const insertedBanners = await Banner.insertMany(banners);

    console.log(
      `Successfully migrated ${insertedBanners.length} banners`
    );

    insertedBanners.forEach((banner) => {
      console.log(`✓ ${banner.title}`);
    });

    console.log("Banners migration completed");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Banner migration failed:", error.message);
    process.exit(1);
  }
}

migrateBanners();