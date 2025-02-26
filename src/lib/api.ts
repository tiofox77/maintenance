import { supabase } from "./supabase";
import {
  Task,
  TaskFormData,
  Department,
  Equipment,
  TaskCategory,
} from "./types";

// Department APIs
export async function getDepartments() {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Department[];
}

export async function createDepartment(name: string) {
  const { data, error } = await supabase
    .from("departments")
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data as Department;
}

export async function updateDepartment(id: string, name: string) {
  const { data, error } = await supabase
    .from("departments")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Department;
}

// Equipment APIs
export async function getEquipment() {
  const { data, error } = await supabase
    .from("equipment")
    .select("*, departments(*)")
    .order("number");

  if (error) throw error;
  return data as (Equipment & { departments: Department })[];
}

export async function createEquipment(
  equipment: Omit<Equipment, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("equipment")
    .insert([equipment])
    .select()
    .single();

  if (error) throw error;
  return data as Equipment;
}

// Task Category APIs
export async function getTaskCategories() {
  const { data, error } = await supabase
    .from("task_categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as TaskCategory[];
}

export async function createTaskCategory(name: string) {
  const { data, error } = await supabase
    .from("task_categories")
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data as TaskCategory;
}

// Task APIs
export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      departments:department_id(*),
      equipment:equipment_id(*),
      categories:category_id(*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as (Task & {
    departments: Department;
    equipment: Equipment;
    categories: TaskCategory;
  })[];
}

export async function createTask(taskData: TaskFormData) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        title: taskData.title,
        description: taskData.description,
        frequency: taskData.frequency,
        due_date: taskData.start_date.toISOString(),
        department_id: taskData.department_id,
        equipment_id: taskData.equipment_id,
        category_id: taskData.category_id,
        priority: taskData.priority,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...taskData, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTaskStatus(taskId: string, status: Task["status"]) {
  return updateTask(taskId, { status });
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
}

export async function deleteDepartment(id: string) {
  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteEquipment(id: string) {
  const { error } = await supabase.from("equipment").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteTaskCategory(id: string) {
  const { error } = await supabase
    .from("task_categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
