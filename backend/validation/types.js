const zod = require("zod");

// Schema for registration
const userSchema = zod.object({
  name: zod.string(), // Make name optional
  email: zod.string().email(),
  password: zod.string().min(8),
  createdAt: zod.date().optional(),
  updatedAt: zod.date().optional(),
});

// Schema for login
const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

const fundSchema = zod.object({
  amount: zod
    .number()
    .positive("Amount must be a positive number")
    .min(1, "Minimum amount to add is 1"),
});

const transferSchema = zod.object({
  recipientId: zod.string().min(1, "Recipient ID must be provided"),
  amount: zod.number().positive("Amount must be greater than zero"),
});


module.exports = {
  userSchema,
  loginSchema,
  fundSchema,
  transferSchema
};
