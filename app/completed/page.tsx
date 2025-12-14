'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Todo, Category } from '@/types';
import { getTodos } from '@/services/todoService';
import { getCategories } from '@/services/categoryService';
import TodoCard from '@/components/TodoCard';

export default function CompletedPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [t, c] = await Promise.all([getTodos(true), getCategories()]);
      setTodos(t.sort((a,b) => (b.completedAt || 0) - (a.completedAt || 0)));
      setCategories(c);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 5, mx: 'auto', display: 'block' }} />;

  return (
    <Box>
      <Typography variant="h5" mb={3} fontWeight="bold">Completed Tasks</Typography>
      {todos.map(todo => (
        <TodoCard 
          key={todo.id} 
          todo={todo} 
          category={categories.find(c => c.id === todo.categoryId)} 
          hideActions
        />
      ))}
    </Box>
  );
}
