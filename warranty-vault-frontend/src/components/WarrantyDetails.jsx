import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";

export default function WarrantyDetails() {
  const { id } = useParams();
  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/upload/warranty/${id}`);
        setWarranty(data.warranty);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!warranty) return <Typography>Not found</Typography>;

  return (
    <Card
      component={RouterLink}
      to={`/warranty/${w._id}`}
      sx={{
        textDecoration: "none",
        m: 1,
        minHeight: "160px",
        transition: "0.2s",
        boxShadow: 3,
        ":hover": { boxShadow: 7, transform: "scale(1.02)" },
      }}
    >
      <CardContent sx={{textAlign: "left"}}>
        <Typography variant="h5">{warranty.productName}</Typography>
        <Typography>Brand: {warranty.brand}</Typography>
        <Typography>Model: {warranty.model}</Typography>
        <Typography>Serial: {warranty.serialNumber}</Typography>
        <Typography>
          Purchase Date:{" "}
          {warranty.purchaseDate
            ? new Date(warranty.purchaseDate).toLocaleDateString()
            : "N/A"}
        </Typography>
        <Typography>
          Expiry:{" "}
          {warranty.warrantyExpiryDate
            ? new Date(warranty.warrantyExpiryDate).toLocaleDateString()
            : "N/A"}
        </Typography>
        <Typography>
          Status:{" "}
          {warranty.warrantyStatus.expired
            ? "Expired"
            : `${warranty.warrantyStatus.daysLeft} days left`}
        </Typography>
      </CardContent>
    </Card>
  );
}
