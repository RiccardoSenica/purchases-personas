import fs from 'fs';
import { Persona } from './types';

export function savePersonaJson(persona: Persona, id: number) {
  fs.promises.writeFile(`personas/${id}.json`, JSON.stringify(persona), 'utf8');

  console.log(`Persona ${persona.core.name} saved as persona/${id}.json`);
}
