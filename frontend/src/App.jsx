import "./styles/app.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./routes/home/HomePage";
import MyRepairs from "./routes/repairs/MyRepairs";
import NewRepair from "./routes/repairs/NewRepair";

function App() {
  const router = createBrowserRouter([
    {
      path: "/my-repairs",
      element: <MyRepairs />,
    },
    {
      path: "/new-repair",
      element: <NewRepair />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
