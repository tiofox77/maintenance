import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DepartmentForm } from "@/components/departments/DepartmentForm";
import {
  getDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "@/lib/api";
import { EditDepartmentDialog } from "@/components/departments/EditDepartmentDialog";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { Department } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepartmentsPage() {
  const [editingDepartment, setEditingDepartment] =
    React.useState<Department | null>(null);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreateDepartment = async (name: string) => {
    try {
      await createDepartment(name);
      loadDepartments();
      toast({
        title: "Success",
        description: "Department created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout title="Departments">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Departments</CardTitle>
          <DepartmentForm onSubmit={handleCreateDepartment} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Loading departments...
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>
                      {new Date(department.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingDepartment(department)}
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
                              <AlertDialogTitle>
                                Delete Department
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this department?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await deleteDepartment(department.id);
                                    loadDepartments();
                                    toast({
                                      title: "Success",
                                      description:
                                        "Department deleted successfully",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description:
                                        "Failed to delete department",
                                      variant: "destructive",
                                    });
                                  }
                                }}
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
      </Card>
      {editingDepartment && (
        <EditDepartmentDialog
          department={editingDepartment}
          isOpen={true}
          onClose={() => setEditingDepartment(null)}
          onSave={async (id, name) => {
            try {
              await updateDepartment(id, name);
              loadDepartments();
              toast({
                title: "Success",
                description: "Department updated successfully",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to update department",
                variant: "destructive",
              });
            }
          }}
        />
      )}
    </PageLayout>
  );
}
