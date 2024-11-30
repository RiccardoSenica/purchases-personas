import { z } from 'zod';

const petSchema = z.object({
  type: z.string(),
  name: z.string()
});

const regularStopSchema = z.object({
  location: z.string(),
  purpose: z.string(),
  frequency: z.string()
});

const weekdayActivitySchema = z.object({
  activity: z.string(),
  location: z.string(),
  duration_minutes: z.number()
});

const brandPreferenceSchema = z.object({
  name: z.string(),
  loyalty_score: z.number().min(1).max(10)
});

const subscriptionSchema = z.object({
  name: z.string(),
  amount: z.number(),
  frequency: z.string(),
  next_due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum([
    'housing',
    'utilities',
    'insurance',
    'services',
    'memberships',
    'digital',
    'taxes',
    'other'
  ]),
  is_fixed_expense: z.boolean(),
  auto_payment: z.boolean()
});

const spendingCategorySchema = z.object({
  preference_score: z.number().min(1).max(10),
  monthly_budget: z.number()
});

const exerciseActivitySchema = z.object({
  activity: z.string(),
  frequency: z.string(),
  duration_minutes: z.number()
});

export type ExerciseActivity = z.infer<typeof exerciseActivitySchema>;

const socialActivitySchema = z.object({
  activity: z.string(),
  frequency: z.string()
});

export type SocialActivity = z.infer<typeof socialActivitySchema>;

const upcomingEventSchema = z.object({
  name: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  importance: z.number().min(1).max(10)
});

const coreSchema = z.object({
  age: z.number(),
  name: z.string(),
  occupation: z.object({
    title: z.string(),
    level: z.string(),
    income: z.number(),
    location: z.string(),
    schedule: z.array(z.string())
  }),
  home: z.object({
    type: z.string(),
    ownership: z.string(),
    location: z.string(),
    commute_distance_km: z.number()
  }),
  household: z.object({
    status: z.string(),
    members: z.array(z.string()),
    pets: z.array(petSchema)
  })
});

const routinesSchema = z.object({
  weekday: z.record(weekdayActivitySchema),
  weekend: z.array(z.string()),
  commute: z.object({
    method: z.string(),
    route: z.array(z.string()),
    regular_stops: z.array(regularStopSchema)
  })
});

const preferencesSchema = z.object({
  diet: z.array(z.string()),
  brands: z.array(brandPreferenceSchema),
  price_sensitivity: z.number().min(1).max(10),
  payment_methods: z.array(z.string())
});

const financesSchema = z.object({
  subscriptions: z.array(subscriptionSchema),
  spending_patterns: z.object({
    impulsive_score: z.number().min(1).max(10),
    categories: z.record(spendingCategorySchema)
  })
});

const habitsSchema = z.object({
  exercise: z.array(exerciseActivitySchema),
  social: z.array(socialActivitySchema)
});

const contextSchema = z.object({
  stress_triggers: z.array(z.string()),
  reward_behaviors: z.array(z.string()),
  upcoming_events: z.array(upcomingEventSchema)
});

export const personaSchema = z.object({
  core: coreSchema,
  routines: routinesSchema,
  preferences: preferencesSchema,
  finances: financesSchema,
  habits: habitsSchema,
  context: contextSchema
});

export type Persona = z.infer<typeof personaSchema>;
