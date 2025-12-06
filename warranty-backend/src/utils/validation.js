import { z } from 'zod';

export const warrantySchema = z.object({
  product_name: z.string().min(1, "Product name is required").optional(),
  purchase_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid purchase date format",
  }).optional().nullable(),
  expiry_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid expiry date format",
  }).optional().nullable(),
  warranty_period: z.string().optional().nullable(),
  serial_number: z.string().optional().nullable(),
  file_path: z.string().min(1, "File path is required").optional(), // Optional for updates
});

export const validateWarranty = (data) => {
  return warrantySchema.safeParse(data);
};
