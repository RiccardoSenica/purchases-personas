import { Persona } from '../persona/types';

function formatFrequencyList(
  items?: Array<{ name: string; frequency: number }>
): string {
  if (!items?.length) return '(No data available)';
  return items
    .sort((a, b) => b.frequency - a.frequency)
    .map(item => `- ${item.name} (${item.frequency}x per month)`)
    .join('\n');
}

function formatCategories(categories?: {
  [key: string]: { preference: number; frequency: number };
}): string {
  if (!categories || Object.keys(categories).length === 0)
    return '(No categories defined)';
  return Object.entries(categories)
    .map(([category, data]) => {
      const weeklyFrequency = Math.round(data.frequency * 4.33); // Monthly to weekly
      return `- ${category}: ${weeklyFrequency}x per week (preference: ${data.preference}/10)`;
    })
    .join('\n');
}

function formatActivities(
  activities?: Array<{ name: string; frequency: number; schedule?: string[] }>
): string {
  if (!activities?.length) return '(No activities listed)';
  return activities
    .map(
      act =>
        `- ${act.name}: ${act.frequency}x per ${act.schedule ? act.schedule.join(', ') : 'week'}`
    )
    .join('\n');
}

function formatList(items?: string[]): string {
  if (!items?.length) return '(None listed)';
  return items.join(', ');
}

async function generatePurchasePrompt(persona: Persona): Promise<string> {
  try {
    const sections: string[] = [];

    sections.push(`PERSONAL PROFILE:
Name: ${persona.core.name || 'Unknown'}
Age: ${persona.core.age || 'Unknown'}
Occupation: ${persona.core.occupation?.title || 'Unknown'}${
      persona.core.occupation?.level
        ? ` (${persona.core.occupation.level})`
        : ''
    }
Income: ${persona.core.occupation?.income ? `$${persona.core.occupation.income.toLocaleString()}/year` : 'Unknown'}
Location: ${persona.core.home?.location || 'Unknown'}
Household: ${persona.core.household?.status || 'Unknown'}${
      persona.core.household?.pets?.length
        ? `\nPets: ${persona.core.household.pets
            .map(pet => `${pet.type || 'pet'} named ${pet.name}`)
            .join(', ')}`
        : ''
    }`);

    if (persona.core.occupation?.schedule?.length) {
      sections.push(
        `WORK SCHEDULE:\n${persona.core.occupation.schedule.join('\n')}`
      );
    }

    if (persona.preferences?.shopping) {
      sections.push(`REGULAR SHOPPING PATTERNS:
${persona.preferences.shopping.grocery_stores?.length ? `Grocery Stores:\n${formatFrequencyList(persona.preferences.shopping.grocery_stores)}` : ''}
${persona.preferences.shopping.coffee_shops?.length ? `\nCoffee Shops:\n${formatFrequencyList(persona.preferences.shopping.coffee_shops)}` : ''}
${persona.preferences.shopping.restaurants?.length ? `\nRestaurants:\n${formatFrequencyList(persona.preferences.shopping.restaurants)}` : ''}
${persona.preferences.shopping.retail?.length ? `\nRetail:\n${formatFrequencyList(persona.preferences.shopping.retail)}` : ''}`);
    }

    if (persona.finances?.spending_patterns?.categories) {
      sections.push(
        `SPENDING CATEGORIES & FREQUENCY:\n${formatCategories(persona.finances.spending_patterns.categories)}`
      );
    }

    if (persona.preferences || persona.finances?.spending_patterns) {
      sections.push(`PAYMENT PREFERENCES:
${persona.preferences?.payment_methods ? `- Methods: ${formatList(persona.preferences.payment_methods)}` : ''}
${persona.preferences?.price_sensitivity ? `- Price Sensitivity: ${persona.preferences.price_sensitivity}/10` : ''}
${persona.finances?.spending_patterns?.impulsive_score ? `- Impulsiveness Score: ${persona.finances.spending_patterns.impulsive_score}/10` : ''}`);
    }

    if (persona.routines?.commute?.regular_stops?.length) {
      sections.push(`REGULAR ROUTINES:
Commute Stops:
${persona.routines.commute.regular_stops
  .map(
    stop => `- ${stop.frequency} visits to ${stop.location} for ${stop.purpose}`
  )
  .join('\n')}`);
    }

    if (persona.preferences) {
      const preferencesSection = [`PREFERENCES:`];
      if (persona.preferences.diet?.length) {
        preferencesSection.push(
          `- Diet: ${formatList(persona.preferences.diet)}`
        );
      }
      if (persona.preferences.brands?.length) {
        preferencesSection.push(
          `- Favorite Brands: ${persona.preferences.brands
            .map(b => `${b.name} (loyalty: ${b.loyaltyScore}/10)`)
            .join(', ')}`
        );
      }
      sections.push(preferencesSection.join('\n'));
    }

    if (persona.habits) {
      const activitiesSection = [`REGULAR ACTIVITIES:`];
      if (persona.habits.exercise?.length) {
        activitiesSection.push(
          `Exercise:\n${formatActivities(persona.habits.exercise)}`
        );
      }
      if (persona.habits.social?.length) {
        activitiesSection.push(
          `\nSocial:\n${formatActivities(persona.habits.social)}`
        );
      }
      if (persona.habits.entertainment?.length) {
        activitiesSection.push(
          `\nEntertainment:\n${formatActivities(persona.habits.entertainment)}`
        );
      }
      sections.push(activitiesSection.join('\n'));
    }

    if (persona.context) {
      const contextSection = [`CONTEXT:`];
      if (persona.context.upcoming_events?.length) {
        contextSection.push(
          `Upcoming Events:\n${persona.context.upcoming_events
            .map(
              event =>
                `- ${event.name} on ${event.date}${event.details ? `: ${event.details}` : ''}`
            )
            .join('\n')}`
        );
      }
      if (persona.context.stress_triggers?.length) {
        contextSection.push(
          `\nStress Triggers: ${formatList(persona.context.stress_triggers)}`
        );
      }
      if (persona.context.reward_behaviors?.length) {
        contextSection.push(
          `\nReward Behaviors: ${formatList(persona.context.reward_behaviors)}`
        );
      }
      sections.push(contextSection.join('\n'));
    }

    if (persona.finances?.subscriptions?.length) {
      sections.push(`EXISTING SUBSCRIPTIONS (exclude from weekly purchases):
${persona.finances.subscriptions.map(sub => `- ${sub.name}: $${sub.amount} (due: ${sub.date})`).join('\n')}`);
    }

    sections.push(`Please generate a detailed list of purchases for one week, including:
1. Date and time of purchase
2. Store/vendor name
3. Items purchased
4. Amount spent
5. Category of spending
6. Whether it was planned or impulse purchase

Consider:
- Regular commute stops and routines
- Exercise and social activities
- Dietary preferences and restrictions
- Brand loyalties and preferred stores
- Work schedule and regular activities
- Price sensitivity and impulsiveness score
- Upcoming events and potential related purchases
${persona.context?.recent_changes?.length ? `- Recent lifestyle changes: ${formatList(persona.context.recent_changes)}` : ''}

Format each purchase as:
[DATE] [TIME] | [STORE] | [ITEMS] | $[AMOUNT] | [CATEGORY] | [PLANNED/IMPULSE]

Generate purchases that align with the persona's lifestyle, income level, and spending patterns.`);

    return sections.filter(section => section.trim().length > 0).join('\n\n');
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw new Error('Failed to generate purchase prompt');
  }
}

export default generatePurchasePrompt;
