import { Persona } from './types';

export function parsePersona(persona: string) {
  return JSON.parse(persona) as Persona;
}
