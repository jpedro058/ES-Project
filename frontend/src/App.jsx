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

function App() {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Auth />,
    },
    /* {
      path: "/home",
      element: (
        <RequireAuth>
          <HomePage contentType="allTasks" />
        </RequireAuth>
      ),
    }, */
    {
      path: "/my-repairs",
      element: <MyRepairs />,
    },
    {
      path: "/repair-details/:id",
      element: <RepairDetails />,
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
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/",
      element: <Navigate to="/auth" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
