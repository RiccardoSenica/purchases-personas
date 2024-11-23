import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

/*
THIS IS THE PROMPT IN HUMAN-READABLE FORMAT:

Generate a JSON object for a persona with the following schema:
{
  "core": {
    "age": <number>,
    "name": <string>,
    "occupation": {
      "title": <string>,
      "level": <string>,
      "income": <number>,
      "location": <string>,
      "schedule": <array of strings>
    },
    "home": {
      "type": <string>,
      "ownership": <string>,
      "location": <string>,
      "commute_distance_km": <number>
    },
    "household": {
      "status": <string>,
      "members": <array of strings>,
      "pets": <array of objects>
    }
  },
  "routines": {
    "weekday": <object with 24 hour timeline>,
    "weekend": <array of regular activities>,
    "commute": {
      "method": <string>,
      "route": <array of locations>,
      "regular_stops": <array of objects>
    }
  },
  "preferences": {
    "diet": <array of strings>,
    "brands": <array of objects with loyalty scores>,
    "price_sensitivity": <number 1-10>,
    "payment_methods": <array of strings>,
    "shopping": {
      "grocery_stores": <array of objects with frequency>,
      "coffee_shops": <array of objects with frequency>,
      "restaurants": <array of objects with frequency>,
      "retail": <array of objects with frequency>
    }
  },
  "finances": {
    "subscriptions": <array of objects with amounts and dates>,
    "regular_bills": <array of objects with amounts and dates>,
    "spending_patterns": {
      "impulsive_score": <number 1-10>,
      "categories": <object with category preferences>
    }
  },
  "habits": {
    "exercise": <array of objects with schedule>,
    "social": <array of objects with frequency>,
    "entertainment": <array of objects with frequency>,
    "vices": <array of objects with frequency>
  },
  "context": {
    "stress_triggers": <array of strings>,
    "reward_behaviors": <array of strings>,
    "upcoming_events": <array of objects with dates>,
    "recent_changes": <array of strings>
  }
}
Generate realistic values for all fields, including specific store names, brands, and locations. All temporal data should be relative to the current week. Frequencies should be specified as times per week. Include coordinates for locations. Use ISO timestamps for dates.
*/

const personaCreationPrompt =
  'Generate a detailed JSON object for a realistic persona following this schema, populating all fields with specific real-world values including store names, brands, coordinates, and locations. Use frequencies per week, ISO timestamps relative to the current week, and include coordinates for all locations. The output should be a complete JSON object with core demographic details (age, job, housing, household), daily routines, shopping preferences with actual store names and visit frequencies, brand loyalties with scores, diet, payment preferences, exercise habits, social patterns, entertainment choices, upcoming events, and stress factors. The data should reflect the current week for all temporal values. Schema: {"core":{age:<number>,"name": <string>,occupation:{title:<string>,level:<string>,income:<number>,location:<string>,schedule:<array of strings>},home:{type:<string>,ownership:<string>,location:<string>,commute_distance_km:<number>},household:{status:<string>,members:<array of strings>,pets:<array of objects>}},"routines":{weekday:<object with 24 hour timeline>,weekend:<array of regular activities>,commute:{method:<string>,route:<array of locations>,regular_stops:<array of objects>}},"preferences":{diet:<array of strings>,brands:<array of objects with loyalty scores>,price_sensitivity:<number 1-10>,payment_methods:<array of strings>,shopping:{grocery_stores:<array of objects with frequency>,coffee_shops:<array of objects with frequency>,restaurants:<array of objects with frequency>,retail:<array of objects with frequency>}},"finances":{subscriptions:<array of objects with amounts and dates>,regular_bills:<array of objects with amounts and dates>,spending_patterns:{impulsive_score:<number 1-10>,categories:<object with category preferences>}},"habits":{exercise:<array of objects with schedule>,social:<array of objects with frequency>,entertainment:<array of objects with frequency>,vices:<array of objects with frequency>},"context":{stress_triggers:<array of strings>,reward_behaviors:<array of strings>,upcoming_events:<array of objects with dates>,recent_changes:<array of strings>}}';

export async function makeRequest() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw Error('Anthropic API key missing.');
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: personaCreationPrompt }]
  });

  if (
    response.stop_reason &&
    response.stop_reason !== 'end_turn' &&
    response.stop_reason !== 'stop_sequence'
  ) {
    throw Error(response.stop_reason);
  }

  console.log('Message ID:', response.id);

  return response.content[0] as { text: string };
}
