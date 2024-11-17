import React from "react";
import logo from "../assets/logo.svg";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };
  const name = localStorage.getItem("name");
  return (
    <header className=" shadow-md">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <Link to="/dashboard">
            <img className="h-8 w-auto" src={logo} alt="" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="sm:flex items-center  sm:gap-2">
              <FaUser className="text-2xl text-[#28609b]" />
              <p className="block   py-2.5 pr-5 text-md capitalize font-medium  text-[#28609b]">{name || "User"}</p>
              <button className="block rounded-md bg-[#28609b] cursor-pointer px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
