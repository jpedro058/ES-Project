import "./styles/app.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./routes/home/HomePage";
import MyRepairs from "./routes/repairs/MyRepairs";
import NewRepair from "./routes/repairs/NewRepair";
import RepairDetails from "./routes/repairs/RepairDetails";
import Auth from "./routes/login/Auth";
import Admin from "./routes/admin/admin";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { currentUser } = useContext(AuthContext);
  return !currentUser ? <Navigate to="/auth" /> : children;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/my-repairs",
      element: (
        <RequireAuth>
          <MyRepairs />
        </RequireAuth>
      ),
    },
    {
      path: "/repair-details/:id",
      element: (
        <RequireAuth>
          <RepairDetails />
        </RequireAuth>
      ),
    },
    {
      path: "/new-repair",
      element: (
        <RequireAuth>
          <NewRepair />
        </RequireAuth>
      ),
    },
    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
