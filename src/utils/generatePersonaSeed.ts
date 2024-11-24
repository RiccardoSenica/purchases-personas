const PROVINCE_CODES = [
  '00', // Roma
  '04', // Latina
  '10', // Torino
  '12', // Cuneo
  '16', // Genova
  '20', // Milano
  '24', // Bergamo
  '25', // Brescia
  '30', // Venezia
  '31', // Treviso
  '35', // Padova
  '40', // Bologna
  '45', // Rovigo
  '47', // Forli-Cesena
  '48', // Ravenna
  '50', // Firenze
  '51', // Pistoia
  '52', // Arezzo
  '53', // Siena
  '54', // Massa-Carrara
  '55', // Lucca
  '56', // Pisa
  '57', // Livorno
  '58', // Grosseto
  '60', // Ancona
  '61', // Pesaro
  '63', // Ascoli Piceno
  '65', // Pescara
  '66', // Chieti
  '67', // L'Aquila
  '70', // Bari
  '71', // Foggia
  '72', // Brindisi
  '73', // Lecce
  '74', // Taranto
  '75', // Matera
  '80', // Napoli
  '81', // Caserta
  '82', // Benevento
  '83', // Avellino
  '84', // Salerno
  '87', // Cosenza
  '88', // Catanzaro
  '89', // Reggio Calabria
  '90', // Palermo
  '91', // Trapani
  '92', // Agrigento
  '93', // Caltanissetta
  '94', // Enna
  '95', // Catania
  '96', // Siracusa
  '97', // Ragusa
  '98' // Messina
];

export function generateRandomCAP(): string {
  const provinceCode =
    PROVINCE_CODES[Math.floor(Math.random() * PROVINCE_CODES.length)];

  const lastThreeDigits = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `${provinceCode}${lastThreeDigits}`;
}

function generateLetters(): string {
  const consonants = 'BCDFGLMNPRSTVZ';
  const vowels = 'AEIOU';

  let result = '';

  const consonantCount = 4 + Math.floor(Math.random() * 2);
  for (let i = 0; i < consonantCount; i++) {
    result += consonants[Math.floor(Math.random() * consonants.length)];
  }

  const extraVowels = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < extraVowels; i++) {
    result += vowels[Math.floor(Math.random() * vowels.length)];
  }

  return result
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

function generateBirthYear(): string {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 50;
  const maxYear = currentYear - 20;
  return Math.floor(Math.random() * (maxYear - minYear) + minYear).toString();
}

function formatPersonaSeed(
  letters: string,
  year: string,
  postalCode: string
): string {
  return `${letters}:${year}:${postalCode}`;
}

function generatePersonaSeed(): string {
  const letters = generateLetters();
  const birthYear = generateBirthYear();
  const postalCode = generateRandomCAP();

  return formatPersonaSeed(letters, birthYear, postalCode);
}

export function generatePrompt(): string {
  const seed = generatePersonaSeed();
  const [letters, year, postalCode] = seed.split(':');

  return `Using the Italian persona seed ${seed}, create a detailed persona of an Italian individual where:
- The letters "${letters}" MUST ALL be included in the person's full name (first name + last name), though the name can contain additional letters
- The person was born in ${year}
- They live in an area with postal code (CAP) ${postalCode}.`;
}
