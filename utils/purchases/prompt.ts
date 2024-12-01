import { ExerciseActivity, Consumer, SocialActivity } from '../consumer/types';
import { getWeekRanges, isDateInRange } from '../dateFunctions';

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

function formatConsumerCore(core: Consumer['core']): string {
  const sections = [
    `${core.name} is a ${core.age}-year-old ${core.occupation.title} at ${core.occupation.location}`,
    `Living: ${core.household.status}, ${core.home.ownership} ${core.home.type} in ${core.home.location}`,
    formatHousehold(core.household)
  ];

  return sections.filter(Boolean).join('\n');
}

function formatHousehold(household: Consumer['core']['household']): string {
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

function formatCommute(commute: Consumer['routines']['commute']): string {
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
  subscriptions: Consumer['finances']['subscriptions']
): string {
  return subscriptions
    .map(
      sub =>
        `- ${sub.name}: €${sub.amount} (${sub.frequency})${sub.auto_payment ? ' [automatic]' : ''}`
    )
    .join('\n');
}

function formatBrands(brands: Consumer['preferences']['brands']): string {
  return brands
    .map(brand => `${brand.name} (loyalty: ${brand.loyalty_score}/10)`)
    .join(', ');
}

function formatWeekSection(
  range: { start: Date; end: Date },
  weekNum: number,
  consumer: Consumer
): string {
  return `=== WEEK ${weekNum}: ${range.start.toISOString().split('T')[0]} to ${range.end.toISOString().split('T')[0]} ===

Context:
${formatWeekContext(range, consumer)}
${formatPurchaseOpportunities(consumer)}`;
}

function formatWeekContext(
  range: { start: Date; end: Date },
  consumer: Consumer
): string {
  const contexts = [];

  if (range.start.getDate() <= 5) {
    contexts.push('Post-salary period');
  }

  const events = consumer.context.upcoming_events.filter(event =>
    isDateInRange(new Date(event.date), range.start, range.end)
  );

  if (events.length) {
    contexts.push(`Events: ${events.map(e => e.name).join(', ')}`);
  }

  return contexts.map(c => `- ${c}`).join('\n');
}

function formatPurchaseOpportunities(consumer: Consumer): string {
  const opportunities = [];

  if (consumer.routines.commute.regular_stops.length) {
    opportunities.push('Regular purchase points:');
    consumer.routines.commute.regular_stops.forEach(stop => {
      opportunities.push(
        `- ${stop.frequency} ${stop.purpose} at ${stop.location}`
      );
    });
  }

  if (consumer.habits.exercise.length) {
    opportunities.push('Activity-related purchases:');
    consumer.habits.exercise.forEach(ex => {
      opportunities.push(`- ${ex.frequency} ${ex.activity} sessions`);
    });
  }

  if (consumer.habits.social.length) {
    opportunities.push('Social spending occasions:');
    consumer.habits.social.forEach(soc => {
      opportunities.push(`- ${soc.frequency} ${soc.activity}`);
    });
  }

  return opportunities.join('\n');
}

export async function generatePrompt(
  consumer: Consumer,
  reflectionThreshold: number,
  targetDate: Date,
  numWeeks: number
): Promise<string> {
  const weekRanges = getWeekRanges(targetDate, numWeeks);

  return `consumer PROFILE:
${formatConsumerCore(consumer.core)}

Daily Schedule:
${formatDailySchedule(consumer.routines.weekday)}
Commute: ${formatCommute(consumer.routines.commute)}

Weekend Activities:
${consumer.routines.weekend.map(activity => `- ${activity}`).join('\n')}

${formatHabits(consumer.habits)}

Financial Profile:
- Income: €${consumer.core.occupation.income.toLocaleString()}/year
- Payment Methods: ${consumer.preferences.payment_methods.join(', ')}
- Price Sensitivity: ${consumer.preferences.price_sensitivity}/10
- Purchasing Style: ${formatPurchasingStyle(consumer.finances.spending_patterns.impulsive_score)}

Monthly Fixed Expenses:
${formatSubscriptions(consumer.finances.subscriptions)}

Spending Categories:
${formatCategories(consumer.finances.spending_patterns.categories)}

Brand Preferences:
${formatBrands(consumer.preferences.brands)}

Dietary Preferences:
${consumer.preferences.diet.join(', ')}

${formatContext(consumer.context)}

PURCHASE GENERATION GUIDELINES:

Generate ${numWeeks} weeks of purchases for ${consumer.core.name}:

${weekRanges
  .map((range, i) => formatWeekSection(range, i + 1, consumer))
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
