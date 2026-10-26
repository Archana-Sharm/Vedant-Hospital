import dotenv from "dotenv";
import mongoose from "mongoose";
import Service from "./Service.js";

dotenv.config();

const services = [
  {
    name: "General Medicine",
    description:
      "Medical consultation, evaluation and management of general medical conditions.",
    icon: "stethoscope",
    category: "Speciality",
    image: "",
    active: true,
    order: 1,
  },

  {
    name: "General Surgery",
    description:
      "Surgical consultation and treatment for a range of general surgical conditions.",
    icon: "syringe",
    category: "Speciality",
    image: "",
    active: true,
    order: 2,
  },

  {
    name: "Orthopaedics",
    description:
      "Diagnosis and treatment of bone, joint and musculoskeletal conditions.",
    icon: "bone",
    category: "Speciality",
    image: "",
    active: true,
    order: 3,
  },

  {
    name: "Gynaecology & Obstetrics",
    description:
      "Women's healthcare, gynaecological and obstetric services.",
    icon: "baby",
    category: "Speciality",
    image: "",
    active: true,
    order: 4,
  },

  {
    name: "Cardiology",
    description:
      "Specialist cardiac consultation and diagnostic services.",
    icon: "heart",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 5,
  },

  {
    name: "Oncology",
    description:
      "Specialist consultation and care for oncology patients.",
    icon: "shield",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 6,
  },

  {
    name: "Neurology",
    description:
      "Specialist consultation and management of neurological conditions.",
    icon: "brain",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 7,
  },

  {
    name: "Nephrology",
    description:
      "Specialist kidney care and nephrology services.",
    icon: "flask",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 8,
  },

  {
    name: "Urology & Urosurgery",
    description:
      "Medical and surgical care for urological conditions.",
    icon: "stethoscope",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 9,
  },

  {
    name: "Gastroenterology",
    description:
      "Specialist care for gastrointestinal conditions.",
    icon: "stethoscope",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 10,
  },

  {
    name: "Neurosurgery",
    description:
      "Surgical services for neurological and neurosurgical conditions.",
    icon: "brain",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 11,
  },

  {
    name: "Plastic & Cosmetic Surgery",
    description:
      "Plastic and cosmetic surgical services.",
    icon: "shield",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 12,
  },

  {
    name: "Spine & Joint Replacement Surgery",
    description:
      "Specialist orthopaedic services for spine and joint conditions.",
    icon: "bone",
    category: "Super-Speciality",
    image: "",
    active: true,
    order: 13,
  },

  {
    name: "Physiotherapy",
    description:
      "Physiotherapy and rehabilitation services.",
    icon: "dumbbell",
    category: "Speciality",
    image: "",
    active: true,
    order: 14,
  },

  {
    name: "Dialysis",
    description:
      "Dialysis services for patients requiring renal care.",
    icon: "flask",
    category: "Facility",
    image: "",
    active: true,
    order: 15,
  },

  {
    name: "ICU & HDU",
    description:
      "Intensive Care Unit and High Dependency Unit for critical and enhanced monitoring.",
    icon: "bed",
    category: "Facility",
    image: "",
    active: true,
    order: 16,
  },

  {
    name: "Emergency & Trauma Care",
    description:
      "Accident, trauma and emergency services available 24 hours.",
    icon: "emergency",
    category: "Emergency",
    image: "",
    active: true,
    order: 17,
  },

  {
    name: "Diagnostic Services",
    description:
      "Pathology, X-Ray, CT Scan, Ultrasonography, ECG, Echo Doppler, Stress Test and Endoscopy.",
    icon: "scan",
    category: "Diagnostics",
    image: "",
    active: true,
    order: 18,
  },
];

async function migrateServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove existing services before migration
    await Service.deleteMany({});

    // Insert all 18 services
    const insertedServices = await Service.insertMany(services);

    console.log(
      `Successfully migrated ${insertedServices.length} services`
    );

    insertedServices.forEach((service) => {
      console.log(`✓ ${service.name}`);
    });

    await mongoose.disconnect();

    console.log("Services migration completed");
  } catch (error) {
    console.error("Services migration failed:", error.message);
    process.exit(1);
  }
}

migrateServices();