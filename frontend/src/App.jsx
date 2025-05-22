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
import RepairDetailsAdmin from "./routes/admin/RepairDetailsAdmin";

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
