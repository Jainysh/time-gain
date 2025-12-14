"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Category } from "@/types";
import {
  getCategories,
  addCategory,
  updateCategory,
} from "@/services/categoryService";

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");

  const fetchCats = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditId(category.id);
      setName(category.name);
      setColor(category.color);
    } else {
      setEditId(null);
      setName("");
      setColor("#ffffff");
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (editId) {
      await updateCategory(editId, { name, color });
    } else {
      await addCategory({ name, color });
    }
    setOpen(false);
    fetchCats();
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Manage Categories
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add New
        </Button>
      </Box>
      <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        {categories.map((cat) => (
          <ListItem key={cat.id} divider>
            <Box
              width={20}
              height={20}
              borderRadius="50%"
              bgcolor={cat.color}
              mr={2}
            />
            <ListItemText primary={cat.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpen(cat)}>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit" : "Add"} Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Color (Hex)"
            fullWidth
            value={color}
            onChange={(e) => setColor(e.target.value)}
            type="color"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
