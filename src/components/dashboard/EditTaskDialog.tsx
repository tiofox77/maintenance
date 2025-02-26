import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/lib/types";

interface EditTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, data: Partial<Task>) => Promise<void>;
  departments: Array<{ id: string; name: string }>;
  equipment: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

export function EditTaskDialog({
  task,
  isOpen,
  onClose,
  onSave,
  departments,
  equipment,
  categories,
}: EditTaskDialogProps) {
  const [isCustomDate, setIsCustomDate] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: task.title,
    description: task.description || "",
    frequency: task.frequency,
    due_date: new Date(task.due_date),
    department_id: task.department_id,
    equipment_id: task.equipment_id,
    category_id: task.category_id,
    priority: task.priority,
    status: task.status,
  });

  React.useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description || "",
      frequency: task.frequency,
      due_date: new Date(task.due_date),
      department_id: task.department_id,
      equipment_id: task.equipment_id,
      category_id: task.category_id,
      priority: task.priority,
      status: task.status,
    });
  }, [task]);

  const calculateDueDate = (startDate: Date, frequency: string) => {
    if (isCustomDate) return startDate;

    const date = new Date(startDate);
    switch (frequency) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        due_date: calculateDueDate(
          formData.due_date,
          formData.frequency,
        ).toISOString(),
      };
      await onSave(task.id, updatedData);
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Due Date</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="customDate">Custom Date</Label>
                <input
                  type="checkbox"
                  id="customDate"
                  checked={isCustomDate}
                  onChange={(e) => setIsCustomDate(e.target.checked)}
                />
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.due_date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" hidden={!isCustomDate}>
                <Calendar
                  mode="single"
                  selected={formData.due_date}
                  onSelect={(date) =>
                    date && setFormData((prev) => ({ ...prev, due_date: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Task["status"]) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Task["priority"]) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={formData.department_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, department_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
