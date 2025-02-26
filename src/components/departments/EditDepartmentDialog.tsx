import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditDepartmentDialogProps {
  department: { id: string; name: string };
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string) => Promise<void>;
}

export function EditDepartmentDialog({
  department,
  isOpen,
  onClose,
  onSave,
}: EditDepartmentDialogProps) {
  const [name, setName] = React.useState(department.name);

  React.useEffect(() => {
    setName(department.name);
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(department.id, name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter department name"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
