import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { AuthContext } from "../Context/UserContext";
import GoogleLogo from "../images/GoogleLogo.png";
import WelcomePageBanner from "../images/WelcomePageBanner.jpg";

function SignIn() {
  const { User, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          navigate("/");
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setLoader(false);
      });
  };

  const loginWithGoogle = (e) => {
    e.preventDefault();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setDoc(doc(db, "Users", user.uid), { email: user.email, Uid: user.uid }, { merge: true })
          .then(() => navigate("/"));
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setLoader(false);
      });
  };

  return (
    <section
      className="h-[100vh] bg-gray-50 dark:bg-gray-900"
      style={{
        background: `linear-gradient(0deg, hsl(0deg 0% 0% / 73%) 0%, hsl(0deg 0% 0% / 73%) 35%),url(${WelcomePageBanner})`,
      }}
    >
      <div className="h-[100vh] flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-[#000000a2] rounded-lg shadow sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0"
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
            <h1 className="text-xl font-bold text-white md:text-2xl">Sign in to your account</h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                <input
                  type="email"
                  className={`bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 ${ErrorMessage ? "border-2 border-red-700" : ""}`}
                  placeholder="amankumartiwari5255@gmail.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-white">Password</label>
                <input
                  type="password"
                  className={`bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 ${ErrorMessage ? "border-2 border-red-700" : ""}`}
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {ErrorMessage && <p className="text-white font-bold bg-red-700 p-4 rounded">{ErrorMessage}</p>}
              <button
                type="submit"
                className={`w-full text-white ${loader ? "bg-stone-700" : "bg-red-700 hover:bg-red-800"} transition font-medium rounded-sm text-sm px-5 py-2.5`}
              >
                {loader ? <ClipLoader color="#ff0000" /> : "Sign in"}
              </button>
              <button
                onClick={loginWithGoogle}
                className="flex justify-center items-center w-full bg-blue-600 hover:bg-blue-800 text-white transition font-medium rounded-sm text-sm px-5 py-2.5"
              >
                {loader ? <ClipLoader color="#ff0000" /> : <><img className="w-8" src={GoogleLogo} alt="Google" /> <p className="ml-1">Sign in with Google</p></>}
              </button>
              <p className="text-sm text-gray-500">
                Don’t have an account yet? <Link to="/signup" className="font-medium text-white hover:underline">Sign up</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SignIn;
