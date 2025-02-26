import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Department } from "@/lib/types";

interface EquipmentFormProps {
  departments: Department[];
  onSubmit: (data: {
    number: string;
    name: string;
    department_id: string;
  }) => Promise<void>;
}

export function EquipmentForm({ departments, onSubmit }: EquipmentFormProps) {
  const [formData, setFormData] = React.useState({
    number: "",
    name: "",
    department_id: "",
  });
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ number: "", name: "", department_id: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Equipment Number</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, number: e.target.value }))
              }
              placeholder="Enter equipment number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter equipment name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, department_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
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
            <Button type="submit">Create Equipment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
