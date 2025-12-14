import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { Category, Todo } from "@/types";
import { addTodo } from "@/services/todoService";

interface Props {
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  categories: Category[];
  onTaskAdded: () => void;
  initialData?: Partial<Todo>;
  onDataChange: (data: Partial<Todo>) => void;
}

export default function AddTaskModal({
  open,
  onClose,
  onMinimize,
  categories,
  onTaskAdded,
  initialData,
  onDataChange,
}: Props) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [deadline, setDeadline] = useState("");

  // 1. Hydrate from initialData ONLY when opening
  useEffect(() => {
    if (open) {
      setTaskName(initialData?.taskName || "");
      setDescription(initialData?.description || "");
      setCategoryId(initialData?.categoryId || categories[0]?.id || "");
      setDeadline(
        initialData?.deadline
          ? new Date(initialData.deadline).toISOString().slice(0, 16)
          : ""
      );
    }
  }, [open]); // Removed other dependencies to prevent re-hydration loops

  // REMOVED: The useEffect that synced changes on every keystroke

  const handleSubmit = async () => {
    if (!taskName || !deadline || !categoryId) return;

    await addTodo({
      taskName,
      description,
      categoryId,
      deadline: new Date(deadline).getTime(),
      createdAt: new Date().getTime(),
      isCompleted: false,
    });

    resetState();
    onTaskAdded();
    onClose();
  };

  // 2. Only sync data to parent when minimizing
  const handleMinimize = () => {
    onDataChange({
      taskName,
      description,
      categoryId,
      deadline: deadline ? new Date(deadline).getTime() : undefined,
    });
    onMinimize();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const resetState = () => {
    setTaskName("");
    setDescription("");
    setDeadline("");
    // We don't clear draft data here, parent handles that
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add New Task
        <Box>
          <IconButton onClick={handleMinimize} sx={{ mr: 1 }}>
            <MinimizeIcon sx={{ mb: 1 }} />
          </IconButton>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Task Name"
            fullWidth
            required
            inputProps={{ maxLength: 120 }}
            helperText={`${taskName.length}/120`}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <TextField
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Deadline"
            type="datetime-local"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <TextField
            select
            label="Category"
            fullWidth
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    width={12}
                    height={12}
                    borderRadius="50%"
                    bgcolor={cat.color}
                  />
                  {cat.name}
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!taskName || !deadline}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
