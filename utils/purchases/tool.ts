export const Tool = {
  name: 'PurchasesSchema' as const,
  input_schema: {
    type: 'object' as const,
    properties: {
      weeks: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            weekNumber: {
              type: 'number' as const,
              description: 'Sequential week number starting from 1'
            },
            startDate: {
              type: 'string' as const,
              description: 'Start date of the week in ISO 8601 format',
              format: 'date'
            },
            endDate: {
              type: 'string' as const,
              description: 'End date of the week in ISO 8601 format',
              format: 'date'
            },
            purchases: {
              type: 'array' as const,
              items: {
                type: 'object' as const,
                properties: {
                  name: {
                    type: 'string' as const,
                    description: 'Name of the purchased item or service'
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
                  category: {
                    type: 'string' as const,
                    description:
                      'Spending category (must match consumer preferences)'
                  },
                  isPlanned: {
                    type: 'boolean' as const,
                    description: 'Whether the purchase was planned or impulse'
                  },
                  context: {
                    type: 'string' as const,
                    description: 'Optional context about purchase circumstances'
                  },
                  reflections: {
                    type: 'array' as const,
                    description: 'Reflections for purchases over threshold',
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
                          description: 'Reflection date in ISO 8601 format',
                          format: 'date-time'
                        },
                        mood: {
                          type: 'string' as const,
                          description: 'Mood during reflection'
                        },
                        relatedTo: {
                          type: 'string' as const,
                          description: 'Optional related event or context'
                        }
                      },
                      required: [
                        'comment',
                        'satisfactionScore',
                        'date',
                        'mood'
                      ] as const
                    }
                  }
                },
                required: [
                  'name',
                  'amount',
                  'datetime',
                  'location',
                  'category',
                  'isPlanned'
                ] as const
              },
              minItems: 12,
              maxItems: 20,
              description: 'List of purchases for this week'
            },
            weekContext: {
              type: 'object' as const,
              properties: {
                events: {
                  type: 'array' as const,
                  items: {
                    type: 'string' as const
                  },
                  description: 'Notable events during this week'
                },
                stressLevel: {
                  type: 'number' as const,
                  minimum: 1,
                  maximum: 10,
                  description: 'Overall stress level for the week'
                },
                notes: {
                  type: 'string' as const,
                  description: 'Additional context about the week'
                }
              }
            }
          },
          required: ['weekNumber', 'startDate', 'endDate', 'purchases'] as const
        }
      }
    },
    required: ['weeks'] as const
  }
} as const;
