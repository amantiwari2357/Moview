import React, { useState, useEffect, useContext } from "react";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../../Context/UserContext";
import logo from "../../images/logo.png";

function Navbar(props) {
  const { User } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [show, handleShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (User) {
      setProfilePic(User.photoURL);
    }
    const transitionNavBar = () => {
      handleShow(window.scrollY > 80);
    };
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, [User]);

  const SignOut = () => {
    signOut(getAuth())
      .then(() => navigate("/"))
      .catch((error) => alert(error.message));
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className={`fixed top-0 z-10 w-full ${props.playPage ? "backdrop-blur-sm" : ""}`}
    >
      <nav className={`transition duration-500 ${show ? "bg-black" : ""}`}>
        <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img className="h-6 w-18 cursor-pointer" src={logo} alt="Movie-Browser" />
              <div className="hidden md:flex ml-10 space-x-4">
                {["Home", "Series", "History", "Liked", "My List"].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(" ", "")}`}
                    className="py-2 font-medium text-white transition hover:text-red-800 lg:px-3 text-m"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Link to="/search">
                <svg
                  className="w-10 h-10 text-white hover:text-red-800 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              {User && <span className="text-white hidden md:block">{User.displayName}</span>}
              <div className="relative group">
                <Link to="/profile">
                  <img
                    className="h-10 w-10 rounded-full cursor-pointer"
                    src={profilePic || "https://www.citypng.com/public/uploads/preview/profile-user-round-red-icon-symbol-download-png-11639594337tco5j3n0ix.png"}
                    alt="User Profile"
                  />
                </Link>
                <ul className="absolute hidden group-hover:block bg-stone-900 text-white mt-1">
                  <li><Link to="/profile" className="block px-4 py-2 hover:bg-red-800">Profile</Link></li>
                  <li><Link to="/signin" className="block px-4 py-2 hover:bg-red-800">Add User</Link></li>
                  <li><button onClick={SignOut} className="block w-full text-left px-4 py-2 hover:bg-red-800">Sign Out</button></li>
                </ul>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 bg-gray-900 hover:text-white hover:bg-gray-800"
              >
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            {["Home", "Series", "History", "Liked", "My List", "Signin"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(" ", "")}`}
                className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white"
              >
                {item}
              </Link>
            ))}
            <button
              onClick={SignOut}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-red-800 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </Transition>
      </nav>
    </motion.header>
  );
}

export default Navbar;
