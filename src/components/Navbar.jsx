import { useEffect, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addLoginData } from "../slices/dataSlice";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProgressSpinner } from "primereact/progressspinner";
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [updateProfileLoader, setUpdateProfileLoader] = useState(false);
  const selector = useSelector((state) => state.dataSlice);
  const fileInput = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      addLoginData({
        username: localStorage.getItem("username"),
        imageUrl: localStorage.getItem("imageUrl"),
      })
    );
  }, []);

  const updateProfile = async () => {
    try {
      setUpdateProfileLoader(true);
      const formData = new FormData();
      console.log(fileInput.current.files[0], "show the files here");

      await formData.append("file", fileInput?.current?.files[0]);
      const response = await axios.put(
        `https://backendbook-i5a3.onrender.com/v1/books/signin/updateprofile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("imageUrl", response.data.data);
      dispatch(
        addLoginData({
          imageUrl: localStorage.getItem("imageUrl"),
        })
      );
      setUpdateProfileLoader(false);
      toast.success(response.data.message);
      console.log(response, "show the updatedProfile Response");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xxl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              BookoPedia
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-dropdown"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-dropdown"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/favourite"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  <span className="flex justify-center items-center">
                    Favourite{" "}
                    <span className="ml-2">
                      <CiStar />
                    </span>
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/Login"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  <span
                    className="flex justify-center items-center"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    LogOut{" "}
                  </span>
                </Link>
              </li>
              <li>
                <div className="block user_initial py-2 px-3 text-gray-900 rounded   md:border-0  md:p-0 dark:text-white">
                  <div
                    className="flex justify-center items-center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <span
                      className="rounded-[50%] cursor-pointer"
                      style={{ width: "100%", height: "100%" }}
                      onClick={() => {
                        setVisible(true);
                      }}
                    >
                      <img
                        src={selector.LoginData.imageUrl}
                        className="rounded-[50%]"
                        alt=""
                        style={{ width: "100%", height: "100%" }}
                      />
                    </span>

                    <Dialog
                      visible={visible}
                      modal
                      header={() => {
                        return <h6 className="">Update Profile</h6>;
                      }}
                      footer={() => {
                        return (
                          <div>
                            <Button
                              onClick={() => {
                                setVisible(false);
                              }}
                              label="cancel"
                              severity="danger"
                              className="deleIcon"
                              raised
                            />
                            <Button
                              onClick={async () => {
                                await updateProfile();
                                setVisible(false);
                              }}
                              label={
                                updateProfileLoader ? (
                                  <div className="card flex justify-content-center">
                                    <ProgressSpinner
                                      style={{ width: "35px", height: "25px" }}
                                      strokeWidth="8"
                                    />
                                  </div>
                                ) : (
                                  <p>Update</p>
                                )
                              }
                              severity="info"
                              className="EditIcon"
                              raised
                            />
                          </div>
                        );
                      }}
                      style={{ width: "50rem" }}
                      onHide={() => setVisible(false)}
                    >
                      <input
                        placeholder="here to upload"
                        type="file"
                        ref={fileInput}
                        name="image"
                        className="p-2"
                        style={{
                          border: "2px solid grey",
                          borderRadius: "4px",
                          backgroundColor: "white",
                        }}
                      />
                    </Dialog>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
