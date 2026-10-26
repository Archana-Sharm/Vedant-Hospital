import mongoose from "mongoose";
import dotenv from "dotenv";
import SocialPost from "./SocialPost.js";

dotenv.config();

const socialPosts = [
  {
    platform: "youtube",
    postUrl: "https://youtube.com",
    embedUrl: "",
    thumbnail:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf",
    caption:
      "Expert talk on cardiac health and preventive cardiology by Dr. Satishkumar Kolekar.",
    date: "2026-08-20",
    active: true,
    order: 1,
  },

  {
    platform: "facebook",
    postUrl: "https://facebook.com",
    embedUrl: "",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f",
    caption:
      "Our orthopaedic team successfully performed 50+ joint replacement surgeries this quarter. Congratulations to the entire team!",
    date: "2026-08-15",
    active: true,
    order: 2,
  },

  {
    platform: "instagram",
    postUrl: "https://instagram.com",
    embedUrl: "",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
    caption:
      "World Health Day at Vedant — free health checkup camp for the community. Thank you to all who participated!",
    date: "2026-08-10",
    active: true,
    order: 3,
  },

  {
    platform: "youtube",
    postUrl: "https://youtube.com",
    embedUrl: "",
    thumbnail:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514",
    caption:
      "Behind the scenes: our state-of-the-art modular operation theatres and ICU facilities.",
    date: "2026-07-28",
    active: true,
    order: 4,
  },
];

async function migrateSocialPosts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await SocialPost.deleteMany({});

    const insertedPosts = await SocialPost.insertMany(
      socialPosts
    );

    console.log(
      `Successfully migrated ${insertedPosts.length} social posts`
    );

    insertedPosts.forEach((post) => {
      console.log(
        `✓ ${post.platform} - ${post.caption}`
      );
    });

    console.log("Social posts migration completed");

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      "Social posts migration failed:",
      error.message
    );

    process.exit(1);
  }
}

migrateSocialPosts();