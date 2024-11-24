import { makeRequest } from './utils/anthropicClient';
import { savePersonaJson } from './utils/savePersonaJson';
import { savePersonaDb } from './utils/savePersonaDb';
import { generatePromptWithMBTI } from './utils/personalityTrait';

const prompt =
  'Generate a detailed, realistic persona with specific real-world values including store names, brands and locations. Use frequencies per week, ISO timestamps relative to the current week. Personality trait: <MBTI_AND_TRAITS_HERE>';

const fullPrompt = generatePromptWithMBTI(prompt);

const personaPromise = makeRequest(fullPrompt);

personaPromise.then(persona => {
  savePersonaDb(persona).then(id => savePersonaJson(persona, id));

  console.log('New persona:', persona);
});
