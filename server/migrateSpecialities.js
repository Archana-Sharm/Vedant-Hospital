import mongoose from "mongoose";
import dotenv from "dotenv";
import Speciality from "./Speciality.js";

dotenv.config();

const specialities = [
  {
    name: "Cardiology",
    description:
      "Comprehensive cardiac care including consultation, diagnostics and intervention.",
    icon: "heart",
    image: "",
    active: true,
    order: 1,
  },
  {
    name: "Neurology & Neurosurgery",
    description:
      "Medical and surgical management of neurological disorders.",
    icon: "brain",
    image: "",
    active: true,
    order: 2,
  },
  {
    name: "Oncology",
    description:
      "Specialist cancer care and oncology consultation.",
    icon: "shield",
    image: "",
    active: true,
    order: 3,
  },
  {
    name: "Orthopaedics & Joint Replacement",
    description:
      "Bone, joint and musculoskeletal care including joint replacement surgery.",
    icon: "bone",
    image: "",
    active: true,
    order: 4,
  },
  {
    name: "Nephrology & Dialysis",
    description:
      "Kidney care, nephrology and dialysis services.",
    icon: "flask",
    image: "",
    active: true,
    order: 5,
  },
  {
    name: "Gynaecology & Obstetrics",
    description:
      "Women's health, maternity and obstetric care.",
    icon: "baby",
    image: "",
    active: true,
    order: 6,
  },
  {
    name: "Gastroenterology",
    description:
      "Specialist gastrointestinal and endoscopy services.",
    icon: "stethoscope",
    image: "",
    active: true,
    order: 7,
  },
  {
    name: "Emergency & Critical Care",
    description:
      "ICU, HDU, casualty and 24-hour emergency services.",
    icon: "emergency",
    image: "",
    active: true,
    order: 8,
  },
];

async function migrateSpecialities() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove existing specialities to prevent duplicates
    await Speciality.deleteMany({});

    const insertedSpecialities = await Speciality.insertMany(specialities);

    console.log(
      `Successfully migrated ${insertedSpecialities.length} specialities`
    );

    insertedSpecialities.forEach((speciality) => {
      console.log(`✓ ${speciality.name}`);
    });

    console.log("Specialities migration completed");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Migration failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateSpecialities();