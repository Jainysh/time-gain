import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // NEW ICON
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { formatDistanceToNow, format } from "date-fns";
import { Todo, Category } from "@/types";

interface Props {
  todo: Todo;
  category?: Category;
  onComplete?: (id: string, comment: string) => void;
  onEdit?: (todo: Todo) => void; // NEW PROP
  onDelete?: (id: string) => void; // NEW PROP
  hideActions?: boolean;
}

export default function TodoCard({
  todo,
  category,
  onComplete,
  onEdit,
  onDelete,
  hideActions = false,
}: Props) {
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [comment, setComment] = useState("");

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const formatTime = (time: number) => {
    const date = new Date(time);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(todo.id, comment);
      setOpenCompleteModal(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 3, position: "relative" }}>
        <CardContent sx={{ pb: "16px !important" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Box display="flex" gap={1} mb={1}>
                {category && (
                  <Chip
                    label={category.name}
                    size="small"
                    sx={{
                      bgcolor: category.color + "40",
                      color: category.color,
                      border: `1px solid ${category.color}`,
                    }}
                  />
                )}
              </Box>
              <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                {todo.taskName}
              </Typography>
              {todo.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {todo.description}
                </Typography>
              )}
            </Box>

            <Box display="flex">
              <>
                {!hideActions && (
                  <IconButton
                    color="success"
                    onClick={() => setOpenCompleteModal(true)}
                  >
                    <CheckCircleOutlineIcon fontSize="large" />
                  </IconButton>
                )}

                {/* 2. EDIT/DELETE MENU */}
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={() => setAnchorEl(null)}
                >
                  {!hideActions && (
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        onEdit?.(todo);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                  )}

                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      onDelete?.(todo.id);
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                  </MenuItem>
                </Menu>
              </>
            </Box>
          </Box>

          <Box mt={2} display="flex" gap={2} flexWrap="wrap">
            <Tooltip
              title={`Created: ${format(new Date(todo.createdAt), "PPpp")}`}
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Created:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ cursor: "pointer", borderBottom: "1px dotted #555" }}
                >
                  {formatTime(todo.createdAt)}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip
              title={`Deadline: ${format(new Date(todo.deadline), "PPpp")}`}
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTimeIcon
                  fontSize="small"
                  color={
                    new Date(todo.deadline) < new Date() ? "error" : "action"
                  }
                  sx={{ width: 16 }}
                />
                <Typography
                  variant="caption"
                  color={
                    new Date(todo.deadline) < new Date()
                      ? "error"
                      : "text.primary"
                  }
                  sx={{ cursor: "pointer", borderBottom: "1px dotted #555" }}
                >
                  {formatTime(todo.deadline)}
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          {todo.closingComment && (
            <Box mt={2} p={1} bgcolor="rgba(255,255,255,0.05)" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">
                Closing Comment:
              </Typography>
              <Typography variant="body2">{todo.closingComment}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openCompleteModal}
        onClose={() => setOpenCompleteModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Complete Task?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Closing Comment (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompleteModal(false)}>Cancel</Button>
          <Button onClick={handleComplete} variant="contained" color="success">
            Mark Complete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
