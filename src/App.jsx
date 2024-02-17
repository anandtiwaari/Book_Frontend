import { useEffect, useState } from "react";
import AllBooks from "./components/AllBooks";
import Favourite from "./components/Favourite";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";

const App = () => {
  return (
    <div>
      <PrimeReactProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute Component={AllBooks} />} />
          <Route
            path="/signUp"
            element={<ProtectedRoute Component={SignUp} />}
          />
          <Route path="/Login" element={<ProtectedRoute Component={Login} />} />
          <Route
            path="/favourite"
            element={<PrivateRoute Component={Favourite} />}
          />
        </Routes>
        <ToastContainer />
      </PrimeReactProvider>
    </div>
  );
};

export default App;
