import { MBTIType } from './types';

const mbtiTypes: MBTIType[] = [
  {
    type: 'INTJ',
    traits: ['analytical', 'planning-focused', 'independent', 'private']
  },
  {
    type: 'ENTJ',
    traits: ['strategic', 'leadership-oriented', 'decisive', 'organized']
  },
  {
    type: 'ISFP',
    traits: ['artistic', 'spontaneous', 'nature-loving', 'adaptable']
  },
  { type: 'ESFJ', traits: ['caring', 'social', 'traditional', 'organized'] },
  { type: 'INTP', traits: ['logical', 'abstract', 'adaptable', 'private'] },
  {
    type: 'ENFP',
    traits: ['enthusiastic', 'creative', 'spontaneous', 'people-oriented']
  },
  { type: 'ISTJ', traits: ['practical', 'factual', 'organized', 'reliable'] },
  {
    type: 'ENFJ',
    traits: ['charismatic', 'inspiring', 'idealistic', 'people-focused']
  },
  {
    type: 'ISTP',
    traits: ['practical', 'adaptable', 'experiential', 'logical']
  },
  { type: 'ESFP', traits: ['spontaneous', 'energetic', 'social', 'practical'] },
  {
    type: 'INFJ',
    traits: ['idealistic', 'organized', 'insightful', 'private']
  },
  {
    type: 'ESTP',
    traits: ['energetic', 'practical', 'spontaneous', 'experiential']
  },
  { type: 'INFP', traits: ['idealistic', 'creative', 'authentic', 'adaptive'] },
  {
    type: 'ENTP',
    traits: ['innovative', 'adaptable', 'analytical', 'outgoing']
  },
  { type: 'ISFJ', traits: ['practical', 'caring', 'organized', 'traditional'] },
  {
    type: 'ESTJ',
    traits: ['practical', 'organized', 'leadership-oriented', 'traditional']
  }
];

export function generatePromptWithMBTI(prompt: string): string {
  const selectedType = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];

  const mbtiJson = JSON.stringify({
    type: selectedType.type,
    traits: selectedType.traits
  });

  return prompt.replace('<MBTI_AND_TRAITS_HERE>', mbtiJson);
}
