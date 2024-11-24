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
              description: 'Purchase amount in USD'
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
            }
          },
          required: ['name', 'amount', 'datetime', 'location'] as const
        }
      }
    },
    required: ['items'] as const
  }
} as const;
