import dotenv from "dotenv";
import mongoose from "mongoose";
import Doctor from "./Doctor.js";

dotenv.config();

const doctors = [
  {
    name: "Dr. Abhishek Karmalkar",
    qualification: "MD",
    specialization: "Internal Medicine",
    experience: "12+ years",
    designation: "Consultant Physician",
    department: "Medicine",
    timing: "Mon–Sat, 9am–1pm",
    fees: "₹500",
    description:
      "Specialist in internal medicine and general medical conditions.",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 1,
  },

  {
    name: "Dr. Priya Bagade-Gowardhan",
    qualification: "MS (OBG)",
    specialization: "Gynaecology & Obstetrics",
    experience: "14+ years",
    designation: "Consultant Gynaecologist",
    department: "Gynaecology",
    timing: "Mon–Sat, 10am–2pm",
    fees: "₹600",
    description:
      "Women's healthcare, gynaecological and obstetric services.",
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 2,
  },

  {
    name: "Dr. Ravikumar Wategaonkar",
    qualification: "DM (Oncology)",
    specialization: "Oncology",
    experience: "16+ years",
    designation: "Senior Oncologist",
    department: "Oncology",
    timing: "Mon–Fri, 11am–3pm",
    fees: "₹800",
    description:
      "Specialist consultation and care for oncology patients.",
    photo:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 3,
  },

  {
    name: "Dr. Satishkumar Kolekar",
    qualification: "DM (Cardiology)",
    specialization: "Cardiology",
    experience: "18+ years",
    designation: "Senior Cardiologist",
    department: "Cardiology",
    timing: "Mon–Sat, 9am–12pm",
    fees: "₹900",
    description:
      "Specialist cardiac consultation and diagnostic services.",
    photo:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 4,
  },

  {
    name: "Dr. Amitkumar Pande",
    qualification: "DM (Neurology)",
    specialization: "Neurology",
    experience: "15+ years",
    designation: "Consultant Neurologist",
    department: "Neurology",
    timing: "Tue, Thu, Sat — 2pm–5pm",
    fees: "₹800",
    description:
      "Specialist consultation and management of neurological conditions.",
    photo:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 5,
  },

  {
    name: "Dr. Ajay Dombale",
    qualification: "MS (Ortho)",
    specialization: "Orthopaedics & Joint Replacement",
    experience: "13+ years",
    designation: "Orthopaedic Surgeon",
    department: "Orthopaedics",
    timing: "Mon–Sat, 10am–1pm",
    fees: "₹600",
    description:
      "Specialises in joint replacement and orthopaedic surgeries.",
    photo:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 6,
  },

  {
    name: "Dr. Siddhesh Dhaygude",
    qualification: "DM (Nephrology)",
    specialization: "Nephrology",
    experience: "11+ years",
    designation: "Nephrologist",
    department: "Nephrology",
    timing: "Mon–Fri, 3pm–6pm",
    fees: "₹700",
    description:
      "Specialist kidney care and nephrology services including dialysis.",
    photo:
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 7,
  },

  {
    name: "Dr. Atul Gowardhan",
    qualification: "MS (Plastic Surgery)",
    specialization: "Plastic & Cosmetic Surgery",
    experience: "14+ years",
    designation: "Plastic Surgeon",
    department: "Plastic Surgery",
    timing: "Wed, Fri — 10am–2pm",
    fees: "₹700",
    description:
      "Plastic and cosmetic surgical services.",
    photo:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&auto=format",
    active: true,
    order: 8,
  },
];

async function migrateDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove existing doctors so the migration does not create duplicates
    await Doctor.deleteMany({});

    // Insert all original doctors
    const insertedDoctors = await Doctor.insertMany(doctors);

    console.log(
      `Successfully migrated ${insertedDoctors.length} doctors`
    );

    insertedDoctors.forEach((doctor) => {
      console.log(`✓ ${doctor.name}`);
    });

    await mongoose.disconnect();

    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
}

migrateDoctors();