import { generate as generatePersona } from './persona/store';

import { generate as generatePurchases } from './purchase/store';

const personaPromise = generatePersona();

const date = new Date();
const numWeeks = 4;

console.log(`Generating persona...`);

personaPromise.then(id => {
  console.log(`Generating purchases for id ${id}...`);

  const purchasesPromise = generatePurchases(id, date, numWeeks);

  purchasesPromise.then(() => {
    console.log('Complete');
  });
});
