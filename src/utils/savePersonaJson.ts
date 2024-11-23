import fs from 'fs';
import { parsePersona } from './parsePersona';

export function savePersonaJson(persona: string, id: number) {
  fs.promises.writeFile(`personas/${id}.json`, persona, 'utf8');

  const personaObject = parsePersona(persona);

  console.log(`Persona ${personaObject.core.name} saved as persona/${id}.json`);
}
