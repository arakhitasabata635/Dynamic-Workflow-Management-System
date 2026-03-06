import { CollectionConfig } from 'payload'

export const Contracts: CollectionConfig = {
  slug: 'contracts',

  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
