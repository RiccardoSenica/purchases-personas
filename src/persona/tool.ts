export const Tool = {
  name: 'PersonaSchema' as const,
  input_schema: {
    type: 'object' as const,
    description: 'User persona',
    properties: {
      core: {
        type: 'object' as const,
        description: 'Core user information and demographics',
        properties: {
          age: {
            type: 'number' as const,
            description: "User's age in years"
          },
          name: {
            type: 'string' as const,
            description: "User's full name"
          },
          occupation: {
            type: 'object' as const,
            description: 'Employment details',
            properties: {
              title: {
                type: 'string' as const,
                description: 'Job title'
              },
              level: {
                type: 'string' as const,
                description: 'Career level (e.g., entry, senior, manager)'
              },
              income: {
                type: 'number' as const,
                description: 'Annual income'
              },
              location: {
                type: 'string' as const,
                description: 'Work location'
              },
              schedule: {
                type: 'array' as const,
                description: 'Working days/hours',
                items: {
                  type: 'string' as const
                }
              }
            }
          },
          home: {
            type: 'object' as const,
            description: 'Housing information',
            properties: {
              type: {
                type: 'string' as const,
                description: 'Type of residence (e.g., apartment, house)'
              },
              ownership: {
                type: 'string' as const,
                description: 'Ownership status (e.g., owned, rented)'
              },
              location: {
                type: 'string' as const,
                description: 'Home address or area'
              },
              commute_distance_km: {
                type: 'number' as const,
                description: 'Distance to work in kilometers'
              }
            }
          },
          household: {
            type: 'object' as const,
            description: 'Household composition',
            properties: {
              status: {
                type: 'string' as const,
                description: 'Marital/living status'
              },
              members: {
                type: 'array' as const,
                description: 'Other household members',
                items: {
                  type: 'string' as const
                }
              },
              pets: {
                type: 'array' as const,
                description: 'Household pets',
                items: {
                  type: 'object' as const,
                  properties: {
                    type: {
                      type: 'string' as const,
                      description: 'Type of pet'
                    },
                    name: {
                      type: 'string' as const,
                      description: "Pet's name"
                    }
                  }
                }
              }
            }
          }
        }
      },
      routines: {
        type: 'object' as const,
        description: 'Daily and weekly routines',
        properties: {
          weekday: {
            type: 'object' as const,
            description: 'Typical weekday schedule',
            additionalProperties: {
              type: 'object' as const,
              properties: {
                activity: {
                  type: 'string' as const,
                  description: 'Activity description'
                },
                location: {
                  type: 'string' as const,
                  description: 'Location of activity'
                },
                duration_minutes: {
                  type: 'number' as const,
                  description: 'Duration in minutes'
                }
              }
            }
          },
          weekend: {
            type: 'array' as const,
            description: 'Regular weekend activities',
            items: {
              type: 'string' as const
            }
          },
          commute: {
            type: 'object' as const,
            description: 'Commute details',
            properties: {
              method: {
                type: 'string' as const,
                description: 'Primary mode of transportation'
              },
              route: {
                type: 'array' as const,
                description: 'Regular route points',
                items: {
                  type: 'string' as const
                }
              },
              regular_stops: {
                type: 'array' as const,
                description: 'Regular stops during commute',
                items: {
                  type: 'object' as const,
                  properties: {
                    location: {
                      type: 'string' as const,
                      description: 'Stop location'
                    },
                    purpose: {
                      type: 'string' as const,
                      description: 'Purpose of stop'
                    },
                    frequency: {
                      type: 'string' as const,
                      description: 'How often this stop is made'
                    }
                  }
                }
              }
            }
          }
        }
      },
      preferences: {
        type: 'object' as const,
        description: 'User preferences and habits',
        properties: {
          diet: {
            type: 'array' as const,
            description: 'Dietary preferences and restrictions',
            items: {
              type: 'string' as const
            }
          },
          brands: {
            type: 'array' as const,
            description: 'Brand preferences',
            items: {
              type: 'object' as const,
              properties: {
                name: {
                  type: 'string' as const,
                  description: 'Brand name'
                },
                loyalty_score: {
                  type: 'number' as const,
                  description: 'Brand loyalty score (1-10)',
                  minimum: 1,
                  maximum: 10
                }
              }
            }
          },
          price_sensitivity: {
            type: 'number' as const,
            description: 'Price sensitivity score (1-10)',
            minimum: 1,
            maximum: 10
          },
          payment_methods: {
            type: 'array' as const,
            description: 'Preferred payment methods',
            items: {
              type: 'string' as const
            }
          }
        }
      },
      finances: {
        type: 'object' as const,
        description: 'Financial information',
        properties: {
          subscriptions: {
            type: 'array' as const,
            description: 'Regular subscriptions',
            items: {
              type: 'object' as const,
              properties: {
                name: {
                  type: 'string' as const,
                  description: 'Subscription name'
                },
                amount: {
                  type: 'number' as const,
                  description: 'Monthly cost'
                },
                frequency: {
                  type: 'string' as const,
                  description: 'Billing frequency'
                },
                next_due_date: {
                  type: 'string' as const,
                  description: 'Next payment date',
                  format: 'date'
                }
              }
            }
          },
          spending_patterns: {
            type: 'object' as const,
            description: 'Spending behavior',
            properties: {
              impulsive_score: {
                type: 'number' as const,
                description: 'Impulse buying tendency (1-10)',
                minimum: 1,
                maximum: 10
              },
              categories: {
                type: 'object' as const,
                description: 'Spending categories',
                additionalProperties: {
                  type: 'object' as const,
                  properties: {
                    preference_score: {
                      type: 'number' as const,
                      description: 'Category preference (1-10)',
                      minimum: 1,
                      maximum: 10
                    },
                    monthly_budget: {
                      type: 'number' as const,
                      description: 'Typical monthly spend'
                    }
                  }
                }
              }
            }
          }
        }
      },
      habits: {
        type: 'object' as const,
        description: 'Regular activities and habits',
        properties: {
          exercise: {
            type: 'array' as const,
            description: 'Exercise routines',
            items: {
              type: 'object' as const,
              properties: {
                activity: {
                  type: 'string' as const,
                  description: 'Type of exercise'
                },
                frequency: {
                  type: 'string' as const,
                  description: 'How often performed'
                },
                duration_minutes: {
                  type: 'number' as const,
                  description: 'Typical duration'
                }
              }
            }
          },
          social: {
            type: 'array' as const,
            description: 'Social activities',
            items: {
              type: 'object' as const,
              properties: {
                activity: {
                  type: 'string' as const,
                  description: 'Type of social activity'
                },
                frequency: {
                  type: 'string' as const,
                  description: 'How often performed'
                }
              }
            }
          }
        }
      },
      context: {
        type: 'object' as const,
        description: 'Contextual information',
        properties: {
          stress_triggers: {
            type: 'array' as const,
            description: 'Known stress factors',
            items: {
              type: 'string' as const
            }
          },
          reward_behaviors: {
            type: 'array' as const,
            description: 'Activities used as rewards',
            items: {
              type: 'string' as const
            }
          },
          upcoming_events: {
            type: 'array' as const,
            description: 'Planned future events',
            items: {
              type: 'object' as const,
              properties: {
                name: {
                  type: 'string' as const,
                  description: 'Event name'
                },
                date: {
                  type: 'string' as const,
                  description: 'Event date',
                  format: 'date'
                },
                importance: {
                  type: 'number' as const,
                  description: 'Event importance (1-10)',
                  minimum: 1,
                  maximum: 10
                }
              }
            }
          }
        }
      }
    }
  }
} as const;
