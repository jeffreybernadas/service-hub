import { z } from "zod";

const usernameSchema = z
  .string({
    required_error: "Username is required",
  })
  .min(3, {
    message: "Username must be at least 3 characters",
  })
  .max(255, {
    message: "Username must be less than 255 characters",
  })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });
const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(8, {
    message: "Password must be at least 8 characters",
  })
  .max(255, {
    message: "Password must be less than 255 characters",
  });

const countrySchema = z.string({
  required_error: "Country is required",
  invalid_type_error: "Country must be a string",
});

export const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email({
    message: "Invalid email address",
  });

const profilePictureSchema = z.string({
  required_error: "Profile picture is required",
  invalid_type_error: "Profile picture must be a string",
});

const usernameOrEmailSchema = z.union([usernameSchema, emailSchema]);

export const signupSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    country: countrySchema,
    email: emailSchema,
    profilePicture: profilePictureSchema.optional(),
    browserName: z.string().optional(),
    deviceType: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  username: usernameOrEmailSchema,
  password: passwordSchema,
  browserName: z.string().optional(),
  deviceType: z.string().optional(),
});

// If user is not logged in
export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

// If user is logged in
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
