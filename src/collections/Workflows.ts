import { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflows',

  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'collectionSlug',
      type: 'text',
      required: true,
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'stepName',
          type: 'text',
        },
        {
          name: 'stepType',
          type: 'select',
          options: ['approval', 'review', 'sign-off', 'comment-only'],
        },
        {
          name: 'assignedRole',
          type: 'text',
        },
        {
          name: 'assignedUser',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'condition',
          type: 'text',
        },
        {
          name: 'slaHours',
          type: 'number',
        },
      ],
    },
  ],
}
