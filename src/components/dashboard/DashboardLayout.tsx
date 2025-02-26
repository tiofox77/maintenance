import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import CalendarView from "./CalendarView";
import PerformanceMetrics from "./PerformanceMetrics";
import QuickAddTask from "./QuickAddTask";
import { Sidebar } from "./Sidebar";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  getDepartments,
  getEquipment,
  getTaskCategories,
} from "@/lib/api";
import { Task, TaskFormData } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

interface DashboardLayoutProps {
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  className = "",
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [tasksData, deptsData, equipData, catsData] = await Promise.all([
        getTasks(),
        getDepartments(),
        getEquipment(),
        getTaskCategories(),
      ]);
      setTasks(tasksData);
      setDepartments(deptsData);
      setEquipment(equipData);
      setCategories(catsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask(data);
      await loadData();
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async (taskId: string, data: Partial<Task>) => {
    try {
      await updateTask(taskId, data);
      await loadData();
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      await updateTaskStatus(taskId, status);
      loadData();
      toast({
        title: "Success",
        description: "Task status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="w-64 border-r bg-white" />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Task Management Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Welcome to your task management overview
              </p>
            </div>
            <QuickAddTask onSubmit={handleCreateTask} />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Total Tasks",
                value: tasks.length,
                color: "bg-blue-500",
              },
              {
                title: "Pending Tasks",
                value: tasks.filter((t) => t.status === "pending").length,
                color: "bg-yellow-500",
              },
              {
                title: "In Progress",
                value: tasks.filter((t) => t.status === "in-progress").length,
                color: "bg-purple-500",
              },
              {
                title: "Completed",
                value: tasks.filter((t) => t.status === "completed").length,
                color: "bg-green-500",
              },
            ].map((stat) => (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}
                  >
                    <span className="text-white text-xl font-bold">
                      {stat.value}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Task List Section */}
              <div className="h-[500px] overflow-auto">
                <TaskList
                  tasks={tasks}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  isLoading={isLoading}
                  departments={departments}
                  equipment={equipment}
                  categories={categories}
                />
              </div>

              {/* Performance Metrics Section */}
              <div className="h-[400px]">
                <PerformanceMetrics
                  completionData={tasks.reduce(
                    (acc, task) => {
                      const dept = task.departments?.name || "Unassigned";
                      const found = acc.find((d) => d.department === dept);
                      if (found) {
                        found.total++;
                        if (task.status === "completed") found.completed++;
                      } else {
                        acc.push({
                          department: dept,
                          total: 1,
                          completed: task.status === "completed" ? 1 : 0,
                        });
                      }
                      return acc;
                    },
                    [] as {
                      department: string;
                      completed: number;
                      total: number;
                    }[],
                  )}
                  distributionData={tasks.reduce(
                    (acc, task) => {
                      const dept = task.departments?.name || "Unassigned";
                      const found = acc.find((d) => d.department === dept);
                      if (found) {
                        found.tasks++;
                      } else {
                        acc.push({ department: dept, tasks: 1 });
                      }
                      return acc;
                    },
                    [] as { department: string; tasks: number }[],
                  )}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="h-[916px]">
              <CalendarView tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
