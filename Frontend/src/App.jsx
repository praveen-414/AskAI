import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import { Toaster } from "react-hot-toast";
import useCurrentUser from "./Hooks/useCurrentUser";
import { useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";

const App = () => {
  useCurrentUser();
  const { user, loading } = useSelector((state) => state.user);
  if (loading) {
    return (
      <div className="loader">
        <MoonLoader size={30} color="#7c3aed" />
      </div>
    );
  }

  const routes = createBrowserRouter([
    {
      path: "/",
      element: user ? <Home /> : <Navigate to="/login" />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
};

export default App;
