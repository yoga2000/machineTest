import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import addImg from "../assets/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/employee/get");
      const data = response.data.data;
      const sortedEmployees = data?.sort((a, b) => a.name.localeCompare(b.name));
      setEmployees(sortedEmployees);
      console.log(sortedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:4000/api/employee/delete/${id}`)
      .then(() => {
        fetchEmployees();
      })
      .catch((error) => {
        console.error("Error deleting employee:", error.message);
      });
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const filteredEmployees = (employees.length > 0 && employees.filter((employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase()))) || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className=" w-[98%] m-4 bg-white rounded-lg mx-auto border-2 border-gray-300 shadow-md">
      <div className="flex justify-between items-center p-4 rounded-t-lg border-b">
        <p className="text-xl font-semibold text-gray-700">List of Employees</p>
        <Link to={`/create`} className="flex items-center bg-blue-600 px-4 py-2 text-sm font-medium text-white rounded-md shadow-md hover:bg-blue-700 transition-all duration-200">
          <FiPlusCircle size={20} className="mr-2" /> Add Employee
        </Link>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-gray-600 font-medium">Total Employees: {filteredEmployees.length}</p>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  ID
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Mobile
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Designation
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Gender
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Courses
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Image
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Created At
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                currentData.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee?.empId}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee.mobile_no}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee.designation}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee.gender}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee.course.map((course) => course).join(", ")}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <img src={employee?.img || addImg} alt={employee.name} className="w-12 h-12 rounded-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{employee.createdAt.split("T")[0]}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <Link to={`/update/${employee._id}`} className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors">
                          Edit
                        </Link>
                        <button onClick={() => deleteUser(employee._id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 text-sm font-medium border rounded-md transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default List;
