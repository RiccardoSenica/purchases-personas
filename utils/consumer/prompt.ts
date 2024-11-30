import { generateConsumerSeed } from '../generateConsumerSeed';

export function generatePrompt(): string {
  const seed = generateConsumerSeed();
  const [letters, year, postalCode] = seed.split(':');

  return `You are tasked with creating a detailed consumer of an Italian individual based on the following seed information:
  
  <consumer_seed>
    <name_letters>${letters}</name_letters>
    <birth_year>${year}</birth_year>
    <postal_code>${postalCode}</postal_code>
  </consumer_seed>
  
  Your goal is to generate a realistic and diverse consumer that reflects the complexity of Italian society. Follow these steps to create the consumer:
  
  1. Analyze the demographic data:
     - Create a full name that includes ALL the letters provided in <name_letters>, though it may contain additional letters.
     - Consider the implications of the birth year and postal code on the person's background and lifestyle.
  
  2. Generate core demographics:
     - Name and age (derived from the seed information)
     - Occupation (including title, level, approximate income, location, and schedule)
     - Home situation (residence type, ownership status, location)
     - Household (relationship status, family members, pets if any)
  
  3. Describe daily patterns:
     - Detailed weekday schedule with approximate times and locations
     - Typical weekend activities
     - Commute details (transportation method, route, regular stops if applicable)
  
  4. Define preferences and behaviors:
     - Financial management style
     - Brand relationships (with loyalty scores from 1 to 10)
     - Preferred payment methods
  
  5. Outline a financial profile:
     - Fixed monthly expenses:
       * Housing: rent/mortgage payments
       * Utilities: electricity, gas, water, waste management
       * Internet and phone services
       * Insurance payments (home, car, health, life)
       * Property taxes (if applicable)
     - Regular subscriptions:
       * Digital services (streaming, apps, etc.)
       * Memberships (gym, clubs, etc.)
       * Regular services (cleaning, maintenance, etc.)
     - Category-specific spending patterns
     - Impulse buying tendency (score from 1 to 10)
  
  6. Describe regular activities:
     - Exercise routines or lack thereof
     - Social activities
  
  7. Add consumerl context:
     - Key stress triggers
     - Reward behaviors
     - Upcoming significant events
  
  Throughout this process, consider the following:
  - Ensure a diverse representation of technological aptitudes, not focusing solely on tech-savvy individuals.
  - Use inclusive language and avoid stereotypes or discriminatory assumptions.
  - Align numerical scores (1-10) and monetary values (in EUR) with:
    a) Regional economic indicators
    b) Generational trends
    c) Professional sector norms
    d) Local cost of living
  
  Before providing the final consumer, wrap your analysis in <consumer_creation_process> tags. For each major section:
  1. Break down the postal code implications on the person's background and lifestyle.
  2. Consider multiple options for each aspect (at least 2-3 choices).
  3. Explain your reasoning for the final choice.
  This will help ensure a thorough and well-reasoned consumer creation.`;
}
