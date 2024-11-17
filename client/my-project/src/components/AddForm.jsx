import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EmployeeForm = () => {
  const { id } = useParams();
  console.log(id, "id");
  const [data, setData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    designation: "HR",
    gender: "",
    course: [],
    img: null,
  });

  const [imgPreview, setImgPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:4000/api/employee/getEmployee/${id}`)
        .then((response) => {
          const { name, email, mobile_no, designation, gender, course, img } = response.data.data;
          setData({
            name,
            email,
            mobile_no,
            designation,
            gender,
            course,
            img: null,
          });
          setImgPreview(img ? img : null);
        })
        .catch((error) => {
          console.error("Error fetching employee:", error.message);
        });
    }
  }, [id]);

  const onChangeHandler = (e) => {
    const { name, value, files, checked } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      // Check if file size is less than 5MB
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size should be less than 5 MB");
        return;
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("Only .jpg and .png files are allowed!");
        setImgPreview(null);

        return;
      }

      setData((prev) => ({ ...prev, img: file }));

      // Generate image preview URL
      const reader = new FileReader();
      reader.onload = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (name === "course") {
      setData((prev) => ({
        ...prev,
        course: checked
          ? [...prev.course, value] // Add course if checked
          : prev.course.filter((course) => course !== value), // Remove course if unchecked
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (!data.name || !data.email || !data.mobile_no || !data.designation || !data.gender || !data.course.length) {
        alert("Please fill all the fields");
        return;
      }

      const employeePayload = { ...data };
      delete employeePayload.img;

      if (id) {
        response = await axios.put(`http://localhost:4000/api/employee/edit/${id}`, employeePayload);
      } else {
        response = await axios.post("http://localhost:4000/api/employee/create", employeePayload);
      }

      if (response.status === 200) {
        const employee = response.data.data;
        console.log(employee, "123456");

        if (data.img) {
          const formData = new FormData();
          formData.append("image", data.img);

          const uploadResponse = await axios.post(`http://localhost:4000/api/employee/upload/${employee._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log(uploadResponse);

          if (uploadResponse.status === 200) {
            setData((prev) => ({ ...prev, name: "", email: "", mobile_no: "", designation: "", gender: "", course: [], img: null }));
            alert(id ? "Employee updated successfully" : "Employee added successfully ");
          }
        } else {
          alert(id ? "Employee updated successfully without image!" : "Employee added successfully without image!");
        }
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="my-4 flex items-center justify-center">
      <form onSubmit={submitHandler} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">{id ? "Update Employee" : "Add Employee"}</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Name</label>
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            placeholder="Enter employee's name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28609b]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Enter employee's email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28609b]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Phone</label>
          <input
            name="mobile_no"
            onChange={onChangeHandler}
            value={data.mobile_no}
            type="text"
            placeholder="Enter employee's phone number"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28609b]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Designation</label>
          <select name="designation" onChange={onChangeHandler} value={data.designation} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28609b]">
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Gender</label>
          <div className="flex items-center space-x-4">
            <label>
              <input type="radio" name="gender" value="Male" onChange={onChangeHandler} className="mr-2" />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" onChange={onChangeHandler} className="mr-2" />
              Female
            </label>
            <label>
              <input type="radio" name="gender" value="Others" onChange={onChangeHandler} className="mr-2" />
              Other
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Courses</label>
          <div className="flex flex-wrap gap-4">
            {["BSC", "MCA", "BCA"].map((courseOption) => (
              <label key={courseOption} className="flex items-center space-x-2">
                <input type="checkbox" name="course" value={courseOption} onChange={onChangeHandler} checked={data.course.includes(courseOption)} className="mr-2" />
                <span>{courseOption}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Upload Image</label>
          <input
            name="image"
            type="file"
            accept=".png, .jpg,"
            onChange={onChangeHandler}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28609b]"
          />
          {imgPreview && (
            <div className="mt-4">
              <p className="text-gray-600 text-sm">Image Preview:</p>
              <img src={imgPreview} name="image" alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-[#28609b] text-white p-3 rounded-md">
          {id ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
