import type { Metadata } from "next";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Claude-inspired Todo PWA",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1d1d1f" />
      </head>
      <body>
        <ThemeRegistry>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Navbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 2,
                maxWidth: 800,
                mx: "auto",
                width: "100%",
              }}
            >
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}

// Helper to fix the Box import error in layout
import { Box } from "@mui/material";
