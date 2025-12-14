export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  taskName: string;
  description?: string;
  createdAt: number; // Timestamp
  deadline: number; // Timestamp
  categoryId: string;
  isCompleted: boolean;
  completedAt?: number;
  closingComment?: string;
}
