const express = require("express");
const { createEmployee, getAllEmployees, editEmployee, empImgUpload, deleteUser, getEmployee } = require("../controller/employeeController");
const router = express.Router();

const { upload } = require("../utils/imgaeUpload");

router.post("/create", createEmployee);
router.get("/get", getAllEmployees);
router.put("/edit/:id", editEmployee);
router.delete("/delete/:id", deleteUser);
router.post("/upload/:id", upload.single("image"), empImgUpload);
router.get("/getEmployee/:id", getEmployee);

module.exports = router;
