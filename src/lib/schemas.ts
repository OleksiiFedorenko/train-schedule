import { z } from "zod";

// AUTH

export const LoginSchema = z.object({
  email: z.string().email("Wrong email"),
  password: z.string().min(8, "Min 8 characters"),
});
export const RegisterSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  email: z.string().email("Wrong email"),
  password: z.string().min(8, "Min 8 characters"),
});
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;

// TRAINS

export const hhmm = /^\d{2}:\d{2}$/;

export const TrainCreateSchema = z.object({
  number: z.string().min(3, "Min 3 characters").max(4, "Max 4 characters"),
  from: z.string().min(2, "Min 2 characters"),
  to: z.string().min(2, "Min 2 characters"),
  departure: z.string().regex(hhmm, "Use HH:MM"),
  arrival: z.string().regex(hhmm, "Use HH:MM"),
});

export const TrainPutSchema = TrainCreateSchema;
export const TrainPatchSchema = z.object({
  number: z.string().min(3).optional(),
  from: z.string().min(2).optional(),
  to: z.string().min(2).optional(),
  departure: z.string().regex(hhmm).optional(),
  arrival: z.string().regex(hhmm).optional(),
});
export type TrainCreate = z.infer<typeof TrainCreateSchema>;
export type TrainPut = z.infer<typeof TrainPutSchema>;