import { useState } from "react";
import { Box, Button, Typography, Input, CircularProgress } from "@mui/material";
import api from "../api/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Select a file first");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("warranty", file);
    try {
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Upload successful!");
    } catch (err) {
      setMessage("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h5">Upload Warranty Document</Typography>
      <Input type="file" onChange={(e) => setFile(e.target.files[0])} sx={{ my: 2 }} />
      <Button variant="contained" onClick={handleUpload} disabled={loading}>
        {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
        Upload
      </Button>
      <Typography>{message}</Typography>
    </Box>
  );
}
