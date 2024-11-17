const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Counter Schema
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 100 },
});

const Counter = mongoose.model("Counter", counterSchema);

const employeeSchema = new Schema(
  {
    empId: { type: String, unique: true, trim: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    mobile_no: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    course: {
      type: [String], // Array of strings
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0; // Ensure at least one course is selected
        },
        message: "At least one course must be selected!",
      },
    },
    img: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
// Modified pre-save middleware
employeeSchema.pre("save", async function (next) {
  try {
    // Only generate empId for new documents
    if (this.isNew && !this.empId) {
      const counter = await Counter.findByIdAndUpdate("employeeId", { $inc: { seq: 1 } }, { new: true, upsert: true });

      this.empId = `EMP${counter.seq}`;
      console.log("Generated empId:", this.empId);
    }
    next();
  } catch (error) {
    console.error("Error in pre-save middleware:", error);
    return next(error);
  }
});
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = {
  Employee,
};
