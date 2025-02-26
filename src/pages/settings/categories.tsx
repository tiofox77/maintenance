import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { TaskCategoryForm } from "@/components/task-categories/TaskCategoryForm";
import {
  getTaskCategories,
  createTaskCategory,
  deleteTaskCategory,
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
import { TaskCategory } from "@/lib/types";
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

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<TaskCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const loadCategories = async () => {
    try {
      const data = await getTaskCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (name: string) => {
    try {
      await createTaskCategory(name);
      loadCategories();
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout title="Task Categories">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Categories</CardTitle>
          <TaskCategoryForm onSubmit={handleCreateCategory} />
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
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      {new Date(category.created_at).toLocaleDateString()}
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
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this category?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  await deleteTaskCategory(category.id);
                                  loadCategories();
                                  toast({
                                    title: "Success",
                                    description:
                                      "Category deleted successfully",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to delete category",
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
