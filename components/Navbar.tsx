"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          My Tasks
        </Typography>
        <Box gap={1} display="flex">
          <Link href="/" passHref>
            <Button color={pathname === "/" ? "primary" : "secondary"}>
              Todos
            </Button>
          </Link>
          <Link href="/completed" passHref>
            <Button color={pathname === "/completed" ? "primary" : "secondary"}>
              History
            </Button>
          </Link>
          <Link href="/admin" passHref>
            <Button color={pathname === "/admin" ? "primary" : "secondary"}>
              Admin
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
