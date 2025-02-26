import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  List,
  BarChart,
  Settings,
  Building2,
  Wrench,
  ListTodo,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { id: "/", label: "Overview", icon: LayoutDashboard },
    { id: "/tasks", label: "Tasks", icon: List },
    { id: "/calendar", label: "Calendar", icon: Calendar },
    { id: "/metrics", label: "Metrics", icon: BarChart },
    {
      id: "/settings",
      label: "Settings",
      icon: Settings,
      submenu: [
        { id: "/settings/departments", label: "Departments", icon: Building2 },
        { id: "/settings/equipment", label: "Equipment", icon: Wrench },
        {
          id: "/settings/categories",
          label: "Task Categories",
          icon: ListTodo,
        },
      ],
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <ScrollArea className="px-1">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <React.Fragment key={item.id}>
                  <Button
                    variant={currentPath === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigate(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                  {item.submenu && currentPath.startsWith("/settings") && (
                    <div className="ml-4 space-y-1 mt-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant={
                            currentPath === subItem.id ? "secondary" : "ghost"
                          }
                          className="w-full justify-start"
                          onClick={() => navigate(subItem.id)}
                        >
                          <subItem.icon className="mr-2 h-4 w-4" />
                          {subItem.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
