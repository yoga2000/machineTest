import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LuLoader2 } from "react-icons/lu";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    password: "",
  });
  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  console.log(data);
  const validate = () => {
    let formErrors = {};
    if (!data.name) formErrors.name = "Name is required";
    if (!data.password) formErrors.password = "Password is required";
    return formErrors;
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      const result = await axios.post("http://localhost:4000/api/admin/login", data);
      console.log(result);
      if (result.status === 200) {
        localStorage.setItem("name", result.data.data.name);
        navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Error: Unauthorized access. Please check your credentials.");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="text-3xl bg-[#28609b] text-white text-center py-2">Login Page</h1>
      <div className="h-screen bg-[#E5F1FF] flex items-center justify-center">
        <div className="w-1/3 bg-white shadow-lg rounded p-5">
          <form onSubmit={submitHandler} className="flex flex-col items-center justify-center">
            <input name="name" type="text" placeholder="Name" className="p-2 m-2 border border-gray-300 rounded w-full" onChange={onChangeHandler} />
            {errors.name && <p className="text-red-500 text-sm text-center">{errors.name}</p>}

            <div className="relative w-full m-2">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className="p-2 border border-gray-300 rounded w-full" onChange={onChangeHandler} />
              <span onClick={togglePasswordVisibility} className="absolute right-3 top-3 cursor-pointer text-gray-500">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
              {errors.password && <p className="text-red-500 text-center text-sm">{errors.password}</p>}
            </div>
            <button disabled={loading} type="submit" className={`${loading ? " cursor-not-allowed" : ""}  bg-[#28609b] text-white p-2 rounded w-full`}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <LuLoader2 size={30} className="animate-spin " />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
