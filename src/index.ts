import { makeRequest } from './utils/anthropicClient';
import { savePersonaJson } from './utils/savePersonaJson';
import { savePersonaDb } from './utils/savePersonaDb';

const personaPromise = makeRequest();

personaPromise.then(persona => {
  savePersonaDb(persona.text).then(id => savePersonaJson(persona.text, id));

  console.log('New persona:', persona.text);
});
