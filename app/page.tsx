'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Fab, FormControl, InputLabel, Select, MenuItem, Stack, CircularProgress, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Todo, Category } from '@/types';
import { getTodos, completeTodo } from '@/services/todoService';
import { getCategories, seedCategories } from '@/services/categoryService';
import TodoCard from '@/components/TodoCard';
import AddTaskModal from '@/components/AddTaskModal';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sorting & Filtering State
  const [sortBy, setSortBy] = useState('deadline');
  const [filterCat, setFilterCat] = useState('all');
  
  // Modal & Minimized State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [draftTask, setDraftTask] = useState<Partial<Todo>>({});

  const fetchData = async () => {
    setLoading(true);
    await seedCategories();
    const [tData, cData] = await Promise.all([getTodos(false), getCategories()]);
    setTodos(tData);
    setCategories(cData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskComplete = async (id: string, comment: string) => {
    await completeTodo(id, comment);
    fetchData();
  };

  // Logic for Sort/Filter
  const processedTodos = todos
    .filter(t => filterCat === 'all' ? true : t.categoryId === filterCat)
    .sort((a, b) => {
      if (sortBy === 'deadline') return a.deadline - b.deadline;
      if (sortBy === 'created') return b.createdAt - a.createdAt;
      if (sortBy === 'name') return a.taskName.localeCompare(b.taskName);
      if (sortBy === 'category') return (categories.find(c => c.id === a.categoryId)?.name || '').localeCompare(categories.find(c => c.id === b.categoryId)?.name || '');
      return 0;
    });

  const handleFabClick = () => {
    setIsModalOpen(true);
    setIsMinimized(false);
  };

  return (
    <Box>
      <Box mb={3} display="flex" gap={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="deadline">Deadline</MenuItem>
            <MenuItem value="created">Created Time</MenuItem>
            <MenuItem value="name">Task Name</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={filterCat} label="Category" onChange={(e) => setFilterCat(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} /> : (
        <Stack spacing={0}>
          {processedTodos.length === 0 ? <Typography textAlign="center" color="text.secondary">No active tasks.</Typography> : null}
          {processedTodos.map(todo => (
            <TodoCard 
              key={todo.id} 
              todo={todo} 
              category={categories.find(c => c.id === todo.categoryId)} 
              onComplete={handleTaskComplete}
            />
          ))}
        </Stack>
      )}

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 24, right: 24 }} 
        onClick={handleFabClick}
      >
        {isMinimized ? (
           <Badge badgeContent="!" color="error"><EditIcon /></Badge>
        ) : (
           <AddIcon />
        )}
      </Fab>

      <AddTaskModal 
        open={isModalOpen && !isMinimized}
        onClose={() => { setIsModalOpen(false); setDraftTask({}); setIsMinimized(false); }}
        onMinimize={() => setIsMinimized(true)}
        categories={categories}
        onTaskAdded={() => { fetchData(); setDraftTask({}); }}
        initialData={draftTask}
        onDataChange={setDraftTask}
      />
    </Box>
  );
}
