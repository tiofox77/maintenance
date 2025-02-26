import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/pages/dashboard";
import TasksPage from "@/pages/tasks";
import CalendarPage from "@/pages/calendar";
import MetricsPage from "@/pages/metrics";
import SettingsPage from "@/pages/settings";
import DepartmentsPage from "@/pages/settings/departments";
import EquipmentPage from "@/pages/settings/equipment";
import CategoriesPage from "@/pages/settings/categories";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/tasks",
    element: <TasksPage />,
  },
  {
    path: "/calendar",
    element: <CalendarPage />,
  },
  {
    path: "/metrics",
    element: <MetricsPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/settings/departments",
    element: <DepartmentsPage />,
  },
  {
    path: "/settings/equipment",
    element: <EquipmentPage />,
  },
  {
    path: "/settings/categories",
    element: <CategoriesPage />,
  },
]);
