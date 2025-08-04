import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const { data } = await api.get("/upload/warranties");
        setWarranties(data.warranties);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchWarranties();
  }, [user]);

  const filteredWarranties = useMemo(
    () =>
      warranties.filter(
        (w) =>
          w.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [warranties, searchTerm]
  );

  if (loading) return <CircularProgress />;
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Your Warranties
      </Typography>
      <TextField
        label="Search by Product or Brand"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredWarranties.length === 0 ? (
          <Typography>No warranties yet. Upload one!</Typography>
        ) : (
          filteredWarranties.map((w) => (
            <Grid item xs={12} sm={6} md={4} key={w._id}>
              <Card
                component={RouterLink}
                to={`/warranty/${w._id}`}
                sx={{ textDecoration: "none" }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {w.productName || "Unknown Product"}
                  </Typography>
                  <Typography>Brand: {w.brand || "N/A"}</Typography>
                  <Typography>
                    Expiry:{" "}
                    {w.warrantyExpiryDate
                      ? new Date(w.warrantyExpiryDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                  <Chip
                    label={
                      w.warrantyStatus.expired
                        ? `Expired (${w.warrantyStatus.daysLeft} days)`
                        : `${w.warrantyStatus.daysLeft} days left`
                    }
                    color={w.warrantyStatus.expired ? "error" : "success"}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}
