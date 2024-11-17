const { Employee } = require("../models/employee");

const createEmployee = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, mobile_no, designation, gender, course, img } = req.body;
    const employee = new Employee({ name, email, mobile_no, designation, gender, course, img });
    await employee.save();
    return res.status(200).json({ message: "Employee created successfully", data: employee });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) return res.status(400).json({ message: "Email already exists" });
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    return res.status(200).json({ data: employees });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editEmployee = async (req, res) => {
  console.log(req.body);
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    if (error.code === 11000) return res.status(400).json({ message: "Email already exists" });
    if (error.name === "CastError") return res.status(400).json({ message: "Invalid employee ID" });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route for image upload
const empImgUpload = async (req, res) => {
  console.log(req.file, req.params.id, "lkfn;kasjf;lkaj;");
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    const updateImg = await Employee.findByIdAndUpdate(req.params.id, { img: imageUrl }, { new: true });
    console.log(updateImg);
    if (!updateImg) {
      return res.status(404).send("Employee not found.");
    }

    res.status(200).json({
      message: "Image uploaded and updated successfully!",
      employee: updateImg,
      filePath: imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
};

const deleteUser = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    return res.status(200).json({ data: employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  editEmployee,
  empImgUpload,
  deleteUser,
  getEmployee,
};
