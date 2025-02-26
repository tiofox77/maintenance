import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2, Wrench, ListTodo } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Departments",
      description: "Manage departments and their details",
      icon: Building2,
      path: "/settings/departments",
    },
    {
      title: "Equipment",
      description: "Manage equipment and machines",
      icon: Wrench,
      path: "/settings/equipment",
    },
    {
      title: "Task Categories",
      description: "Manage task categories",
      icon: ListTodo,
      path: "/settings/categories",
    },
  ];

  return (
    <PageLayout title="Settings">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.path}
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageLayout>
  );
}
