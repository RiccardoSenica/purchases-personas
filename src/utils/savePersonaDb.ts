import { prisma } from './prismaClient';

export async function savePersonaDb(persona: string) {
  const personaObject = JSON.parse(persona);

  const result = await prisma.user.create({
    data: {
      name: personaObject['core']['name'],
      age: personaObject['core']['age'],
      persona: JSON.stringify(persona)
    }
  });

  console.log(`Persona ${result.name} inserted with ID ${result.id}`);

  return result.id;
}
