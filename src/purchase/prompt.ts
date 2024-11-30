import { ExerciseActivity, Persona, SocialActivity } from '../persona/types';
import { getWeekRanges, isDateInRange } from '../utils/dateFunctions';

function formatCategories(
  categories?: Record<
    string,
    { preference_score: number; monthly_budget: number }
  >
): string {
  if (!categories || Object.keys(categories).length === 0) {
    return '(No spending categories defined)';
  }

  return Object.entries(categories)
    .map(([category, data]) => {
      const weeklyBudget = Math.round(data.monthly_budget / 4.33);
      const preferenceLevel =
        data.preference_score >= 8
          ? 'high'
          : data.preference_score >= 5
            ? 'moderate'
            : 'low';
      return `- ${category}: €${weeklyBudget}/week (${preferenceLevel} preference)`;
    })
    .join('\n');
}

function formatHabits(habits: {
  exercise: ExerciseActivity[];
  social: SocialActivity[];
}): string {
  const sections: string[] = [];

  if (habits.exercise?.length) {
    sections.push(
      'Activity Pattern:\n' +
        habits.exercise
          .map(
            ex =>
              `- ${ex.frequency} ${ex.activity} sessions (${ex.duration_minutes}min)`
          )
          .join('\n')
    );
  }

  if (habits.social?.length) {
    sections.push(
      'Social Pattern:\n' +
        habits.social
          .map(soc => `- ${soc.frequency} ${soc.activity}`)
          .join('\n')
    );
  }

  return sections.join('\n\n');
}

function formatContext(context: {
  stress_triggers: string[];
  reward_behaviors: string[];
  upcoming_events: Array<{ name: string; date: string; importance: number }>;
}): string {
  const sections: string[] = [];

  if (context.upcoming_events?.length) {
    sections.push(
      'Key Events:\n' +
        context.upcoming_events
          .map(event => {
            const impact =
              event.importance >= 8
                ? 'significant'
                : event.importance >= 5
                  ? 'moderate'
                  : 'minor';
            return `- ${event.name} (${event.date}) - Priority: ${event.importance}/10\n  Expected spending impact: ${impact}`;
          })
          .join('\n')
    );
  }

  if (context.stress_triggers?.length) {
    sections.push(
      'Stress Factors:\n' +
        context.stress_triggers.map(trigger => `- ${trigger}`).join('\n')
    );
  }

  if (context.reward_behaviors?.length) {
    sections.push(
      'Reward Activities:\n' +
        context.reward_behaviors.map(behavior => `- ${behavior}`).join('\n')
    );
  }

  return sections.join('\n\n');
}

function formatPersonaCore(core: Persona['core']): string {
  const sections = [
    `${core.name} is a ${core.age}-year-old ${core.occupation.title} at ${core.occupation.location}`,
    `Living: ${core.household.status}, ${core.home.ownership} ${core.home.type} in ${core.home.location}`,
    formatHousehold(core.household)
  ];

  return sections.filter(Boolean).join('\n');
}

function formatHousehold(household: Persona['core']['household']): string {
  const sections = [];

  if (household.members.length) {
    sections.push(`Household Members: ${household.members.join(', ')}`);
  }

  if (household.pets.length) {
    sections.push(
      `Pets: ${household.pets.map(pet => `${pet.name} (${pet.type})`).join(', ')}`
    );
  }

  return sections.join('\n');
}

function formatDailySchedule(
  weekday: Record<
    string,
    {
      activity: string;
      location: string;
      duration_minutes: number;
    }
  >
): string {
  return Object.entries(weekday)
    .map(
      ([time, details]) =>
        `- ${time}: ${details.activity} (${details.location})`
    )
    .join('\n');
}

function formatCommute(commute: Persona['routines']['commute']): string {
  return `${commute.method} (${commute.route.join(' → ')})
Regular stops: ${commute.regular_stops
    .map(stop => `${stop.frequency} ${stop.purpose} at ${stop.location}`)
    .join(', ')}`;
}

function formatPurchasingStyle(impulsiveScore: number): string {
  if (impulsiveScore <= 3) return 'Highly planned, rarely impulsive';
  if (impulsiveScore <= 5)
    return 'Mostly planned, occasional impulse purchases';
  if (impulsiveScore <= 7) return 'Balance of planned and impulse purchases';
  return 'Frequently makes impulse purchases';
}

function formatSubscriptions(
  subscriptions: Persona['finances']['subscriptions']
): string {
  return subscriptions
    .map(
      sub =>
        `- ${sub.name}: €${sub.amount} (${sub.frequency})${sub.auto_payment ? ' [automatic]' : ''}`
    )
    .join('\n');
}

function formatBrands(brands: Persona['preferences']['brands']): string {
  return brands
    .map(brand => `${brand.name} (loyalty: ${brand.loyalty_score}/10)`)
    .join(', ');
}

function formatWeekSection(
  range: { start: Date; end: Date },
  weekNum: number,
  persona: Persona
): string {
  return `=== WEEK ${weekNum}: ${range.start.toISOString().split('T')[0]} to ${range.end.toISOString().split('T')[0]} ===

Context:
${formatWeekContext(range, persona)}
${formatPurchaseOpportunities(persona)}`;
}

function formatWeekContext(
  range: { start: Date; end: Date },
  persona: Persona
): string {
  const contexts = [];

  if (range.start.getDate() <= 5) {
    contexts.push('Post-salary period');
  }

  const events = persona.context.upcoming_events.filter(event =>
    isDateInRange(new Date(event.date), range.start, range.end)
  );

  if (events.length) {
    contexts.push(`Events: ${events.map(e => e.name).join(', ')}`);
  }

  return contexts.map(c => `- ${c}`).join('\n');
}

function formatPurchaseOpportunities(persona: Persona): string {
  const opportunities = [];

  if (persona.routines.commute.regular_stops.length) {
    opportunities.push('Regular purchase points:');
    persona.routines.commute.regular_stops.forEach(stop => {
      opportunities.push(
        `- ${stop.frequency} ${stop.purpose} at ${stop.location}`
      );
    });
  }

  if (persona.habits.exercise.length) {
    opportunities.push('Activity-related purchases:');
    persona.habits.exercise.forEach(ex => {
      opportunities.push(`- ${ex.frequency} ${ex.activity} sessions`);
    });
  }

  if (persona.habits.social.length) {
    opportunities.push('Social spending occasions:');
    persona.habits.social.forEach(soc => {
      opportunities.push(`- ${soc.frequency} ${soc.activity}`);
    });
  }

  return opportunities.join('\n');
}

export async function generatePrompt(
  persona: Persona,
  reflectionThreshold: number,
  targetDate: Date,
  numWeeks: number
): Promise<string> {
  const weekRanges = getWeekRanges(targetDate, numWeeks);

  return `PERSONA PROFILE:
${formatPersonaCore(persona.core)}

Daily Schedule:
${formatDailySchedule(persona.routines.weekday)}
Commute: ${formatCommute(persona.routines.commute)}

Weekend Activities:
${persona.routines.weekend.map(activity => `- ${activity}`).join('\n')}

${formatHabits(persona.habits)}

Financial Profile:
- Income: €${persona.core.occupation.income.toLocaleString()}/year
- Payment Methods: ${persona.preferences.payment_methods.join(', ')}
- Price Sensitivity: ${persona.preferences.price_sensitivity}/10
- Purchasing Style: ${formatPurchasingStyle(persona.finances.spending_patterns.impulsive_score)}

Monthly Fixed Expenses:
${formatSubscriptions(persona.finances.subscriptions)}

Spending Categories:
${formatCategories(persona.finances.spending_patterns.categories)}

Brand Preferences:
${formatBrands(persona.preferences.brands)}

Dietary Preferences:
${persona.preferences.diet.join(', ')}

${formatContext(persona.context)}

PURCHASE GENERATION GUIDELINES:

Generate ${numWeeks} weeks of purchases for ${persona.core.name}:

${weekRanges
  .map((range, i) => formatWeekSection(range, i + 1, persona))
  .join('\n\n')}

Purchase Format:
[DATE] [TIME] | [LOCATION] | [ITEMS] | €[AMOUNT] | [CATEGORY] | [PLANNED/IMPULSE]

Reflection Guidelines (for purchases over €${reflectionThreshold}):
- Consider purchase significance and context
- Reference lifestyle impact and usage patterns
- Include relation to events or stress factors
- Account for social context where relevant

Reflection Format:
[DATE] | Mood: [MOOD] | [REFLECTION] | Satisfaction: [SCORE]/10`;
}
