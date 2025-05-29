import { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Admin from "./routes/admin/Admin";
import RepairDetailsAdmin from "./routes/admin/RepairDetailsAdmin";
import HomePage from "./routes/home/HomePage";
import Auth from "./routes/login/Auth";
import MyRepairs from "./routes/repairs/MyRepairs";
import NewRepair from "./routes/repairs/NewRepair";
import RepairDetails from "./routes/repairs/RepairDetails";
import "./styles/App.css";

function RequireAuth({ children }) {
  const { currentUser, currentToken } = useContext(AuthContext);

  const now = new Date().getTime();
  const isTokenValid = currentToken && currentToken.expiry > now;

  if (!currentUser || !isTokenValid) {
    return <Navigate to="/auth" />;
  }

  return children;
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
      path: "/repair-details/:repairId",
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
      path: "/repair-details-admin/:repairId",
      element: <RepairDetailsAdmin />,
    },
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
