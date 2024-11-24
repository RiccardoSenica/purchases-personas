import { prisma } from './prismaClient';
import { Persona } from './types';

export async function savePersonaDb(persona: Persona) {
  const result = await prisma.user.create({
    data: {
      name: persona.core.name,
      age: persona.core.age,
      persona: JSON.stringify(persona)
    }
  });

  console.log(`Persona ${result.name} inserted with ID ${result.id}`);

  return result.id;
}
