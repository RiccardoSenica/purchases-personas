export const Tool = {
  name: 'PurchaseSchema' as const,
  input_schema: {
    type: 'object' as const,
    properties: {
      items: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            name: {
              type: 'string' as const,
              description: 'Name of the purchased item'
            },
            amount: {
              type: 'number' as const,
              description: 'Purchase amount in EUR'
            },
            datetime: {
              type: 'string' as const,
              description: 'Purchase date and time in ISO 8601 format',
              format: 'date-time'
            },
            location: {
              type: 'string' as const,
              description: 'Purchase location'
            },
            notes: {
              type: 'string' as const,
              description: 'Additional purchase details (optional)'
            },
            reflections: {
              type: 'array' as const,
              description:
                'Array of reflections on purchases over threshold amount',
              items: {
                type: 'object' as const,
                properties: {
                  comment: {
                    type: 'string' as const,
                    description: 'Reflective comment about the purchase'
                  },
                  satisfactionScore: {
                    type: 'number' as const,
                    description: 'Purchase satisfaction score (1-10)',
                    minimum: 1,
                    maximum: 10
                  },
                  date: {
                    type: 'string' as const,
                    description: 'Date of the reflection in ISO 8601 format',
                    format: 'date-time'
                  },
                  mood: {
                    type: 'string' as const,
                    description: 'Optional context about mood during reflection'
                  }
                },
                required: ['comment', 'satisfactionScore', 'date'] as const
              }
            }
          },
          required: ['name', 'amount', 'datetime', 'location'] as const
        }
      }
    },
    required: ['items'] as const
  }
} as const;
