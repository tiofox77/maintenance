import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EquipmentForm } from "@/components/equipment/EquipmentForm";
import {
  getEquipment,
  createEquipment,
  getDepartments,
  deleteEquipment,
} from "@/lib/api";
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
import { Equipment, Department } from "@/lib/types";
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

export default function EquipmentPage() {
  const [equipment, setEquipment] = React.useState<Equipment[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [equipmentData, departmentsData] = await Promise.all([
        getEquipment(),
        getDepartments(),
      ]);
      setEquipment(equipmentData);
      setDepartments(departmentsData);
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

  const handleCreateEquipment = async (data: {
    number: string;
    name: string;
    department_id: string;
  }) => {
    try {
      await createEquipment(data);
      loadData();
      toast({
        title: "Success",
        description: "Equipment created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create equipment",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout title="Equipment">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Equipment</CardTitle>
          <EquipmentForm
            departments={departments}
            onSubmit={handleCreateEquipment}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading equipment...
                  </TableCell>
                </TableRow>
              ) : equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No equipment found
                  </TableCell>
                </TableRow>
              ) : (
                equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.number}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {
                        departments.find((d) => d.id === item.department_id)
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Equipment
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this equipment?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  await deleteEquipment(item.id);
                                  loadData();
                                  toast({
                                    title: "Success",
                                    description:
                                      "Equipment deleted successfully",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to delete equipment",
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
