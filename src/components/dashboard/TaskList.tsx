import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "../ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditTaskDialog } from "./EditTaskDialog";

export interface TaskListProps {
  tasks?: Task[];
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
  onEdit?: (taskId: string, data: Partial<Task>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  className?: string;
  isLoading?: boolean;
  departments?: Array<{ id: string; name: string }>;
  equipment?: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string }>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks = [],
  onStatusChange = () => {},
  onEdit = async () => {},
  onDelete = async () => {},
  className = "",
  isLoading = false,
  departments = [],
  equipment = [],
  categories = [],
}) => {
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<string>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "in-progress":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className={`w-full bg-white ${className}`}>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
        <div className="flex flex-wrap gap-4">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePickerWithRange value={dateRange} onChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Loading tasks...
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.departments?.name || "N/A"}</TableCell>
                  <TableCell>{task.equipment?.name || "N/A"}</TableCell>
                  <TableCell>{task.categories?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${task.priority === "high" ? "bg-red-200 text-red-800" : task.priority === "medium" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.frequency}</TableCell>
                  <TableCell>
                    {new Date(task.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTask(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this task? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(task.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onSave={async (taskId, data) => {
            await onEdit(taskId, data);
            setEditingTask(null);
          }}
          departments={departments}
          equipment={equipment}
          categories={categories}
        />
      )}
    </Card>
  );
};

export default TaskList;
