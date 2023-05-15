import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./ErrorPage.jsx";
import axios from "axios";
import User from "./User.jsx";
import Register from "./Register.jsx";

const loader = async () => {
  const { data } = await axios.get("http://localhost:3000/");
  return { data };
};
const action = async ({ request, params }) => {
  const formData = await request.formData();
  const { data } = await axios.post("http://localhost:3000/register", {
    ...Object.fromEntries(formData),
  });
  console.log(data);
  return redirect(`/user/${data._id}`);
};
const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <ErrorPage /> },
  {
    path: "/user/:id",
    element: <User />,
    loader: loader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    action: action,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
