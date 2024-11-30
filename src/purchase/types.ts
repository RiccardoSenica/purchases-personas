import { z } from 'zod';

const isoDateTimeString = z.string().refine(
  value => {
    try {
      return !isNaN(new Date(value).getTime());
    } catch {
      return false;
    }
  },
  { message: 'Invalid ISO 8601 datetime format' }
);

const reflectionSchema = z.object({
  comment: z.string().min(1, 'Comment is required'),
  satisfactionScore: z.number().min(1).max(10),
  date: isoDateTimeString,
  mood: z.string().nullable().optional(),
  relatedTo: z.string().optional()
});

const weekContextSchema = z.object({
  events: z.array(z.string()).optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  notes: z.string().optional()
});

const purchaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
  datetime: isoDateTimeString,
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  isPlanned: z.boolean(),
  context: z.string().optional(),
  notes: z.string().optional(),
  reflections: z.array(reflectionSchema).optional()
});

const weekSchema = z
  .object({
    weekNumber: z.number().positive().int(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    purchases: z
      .array(purchaseSchema)
      .min(12, 'Minimum 12 purchases required per week')
      .max(20, 'Maximum 20 purchases allowed per week'),
    weekContext: weekContextSchema.optional()
  })
  .refine(
    data => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate']
    }
  );

export const purchaseListSchema = z
  .object({
    weeks: z.array(weekSchema).min(1, 'At least one week is required')
  })
  .refine(
    data => {
      const weekNumbers = data.weeks
        .map(w => w.weekNumber)
        .sort((a, b) => a - b);
      return weekNumbers.every((num, idx) => num === idx + 1);
    },
    {
      message: 'Week numbers must be sequential starting from 1',
      path: ['weeks']
    }
  );

export type PurchaseList = z.infer<typeof purchaseListSchema>;
