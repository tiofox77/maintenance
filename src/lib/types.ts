export interface Department {
  id: string;
  name: string;
  created_at: string;
}

export interface Equipment {
  id: string;
  number: string;
  name: string;
  department_id: string;
  created_at: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed" | "in-progress";
  department_id: string;
  equipment_id: string;
  category_id: string;
  due_date: string;
  priority: "high" | "medium" | "low";
  frequency: string;
  created_at: string;
  updated_at?: string;
  departments?: Department;
  equipment?: Equipment;
  categories?: TaskCategory;
}

export interface TaskFormData {
  title: string;
  description?: string;
  frequency: string;
  start_date: Date;
  department_id: string;
  equipment_id: string;
  category_id: string;
  priority: "high" | "medium" | "low";
  due_date?: Date;
}
