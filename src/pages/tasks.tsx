import React from "react";
import TaskList from "@/components/dashboard/TaskList";
import { PageLayout } from "@/components/layout/PageLayout";
import { Task, TaskFormData } from "@/lib/types";
import {
  getTasks,
  getDepartments,
  getEquipment,
  getTaskCategories,
  updateTask,
  deleteTask,
  createTask,
} from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import QuickAddTask from "@/components/dashboard/QuickAddTask";

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [departments, setDepartments] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [equipment, setEquipment] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [categories, setCategories] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
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

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask(data);
      loadData();
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

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      await updateTask(taskId, { status });
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

  const handleEdit = async (taskId: string, data: Partial<Task>) => {
    try {
      await updateTask(taskId, data);
      loadData();
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

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      loadData();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout title="Tasks Management">
      <div className="flex justify-end mb-4">
        <QuickAddTask onSubmit={handleCreateTask} />
      </div>
      <TaskList
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        departments={departments}
        equipment={equipment}
        categories={categories}
        className="h-[calc(100vh-16rem)]"
      />
    </PageLayout>
  );
}
