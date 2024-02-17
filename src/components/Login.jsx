import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { addLoginData } from "../slices/dataSlice";
const Login = () => {
  const [error, setError] = useState("");
  const selector = useSelector((state) => state.dataSlice);
  const dispatch = useDispatch();
  console.log("show the error:", error);
  console.log(selector, "dataSlicedataSlice");
  const [loginValues, setLoginValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { value, name } = e.target;
    setLoginValues({
      ...loginValues,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://backendbook-i5a3.onrender.com/v1/books/signin",
        loginValues
      );
      console.log(response, "show the response here response...");
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response?.data?.accessToken);
        localStorage.setItem("username", response?.data?.user?.username);
        localStorage.setItem("imageUrl", response?.data?.user?.imageUrl);
        localStorage.setItem("userData", JSON.stringify(response?.data?.user));
        toast.success(
          "Welcome " + response?.data?.user?.username?.toUpperCase()
        );
        dispatch(
          addLoginData({
            username: localStorage.getItem("username"),
            imageUrl: localStorage.getItem("imageUrl"),
          })
        );
        navigate("/");
      } else {
        setError(response.response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };
  return (
    <div>
      {" "}
      <div className="relative min-h-screen bg-purple-100 backdrop-blur flex justify-center items-center bg-texture bg-cover py-28 sm:py-0">
        <div className="p-4 sm:p-8 flex-1 ">
          <div className="max-w-[420px] min-w-[320px] bg-white rounded-b-3xl mx-auto">
            <div className="relative h-auto">
              <svg
                className="absolute -top-20 "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
              >
                <path
                  fill="#fff"
                  fillOpacity="1"
                  d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,122.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
              <div className="absolute bottom-5 right-2">
                <a href="#" className="block transition hover:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 stroke-current text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="px-10 pt-4 pb-8 rounded-3xl shadow-xl">
              <div className="mx-auto text-center">
                <h1 className="text-4xl text-gray-800">LogIn</h1>
              </div>

              <form>
                {/* <div className="relative mt-5">
                  <input
                    id="email"
                    name="username"
                    type="text"
                    className="peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-purple-600 py-3  outline-none"
                    placeholder="willPig@tailwind.com"
                    // onChange={handleChangeSignUp}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-600 peer-focus:text-sm"
                  >
                    UserName
                  </label>
                </div> */}
                <div className="mt-5 relative">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    className="peer w-full px-0.5 border-0 border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-purple-600 py-3 outline-none"
                    placeholder="willPig@tailwind.com"
                    onChange={handleLoginChange}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-600 peer-focus:text-sm"
                  >
                    Email
                  </label>
                </div>
                <div className="mt-5 relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="peer w-full px-0.5 border- border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-purple-600 py-3 outline-none"
                    placeholder="Password"
                    onChange={handleLoginChange}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>

                <div className="mt-6">
                  <h5 className="text-red-500">{error}</h5>
                </div>

                <button
                  type="button"
                  className="w-full mt-8 py-4 text-lg text-white font-semibold text-center rounded-full bg-purple-500 transition-all hover:bg-purple-600 focus:outline-none"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <p className="text-center text-sm text-gray-400 mt-4">
                  Have an account ?{" "}
                  <a
                    onClick={() => {
                      navigate("/signUp");
                    }}
                    className="font-semibold text-purple-600 hover:underline"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
