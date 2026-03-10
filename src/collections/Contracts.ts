import { workflowHook } from '@/hooks/workflowHook'
import { CollectionConfig } from 'payload'

export const Contracts: CollectionConfig = {
  slug: 'contracts',

  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [workflowHook],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'workflowStatus',
      type: 'ui',
      admin: {
        components: {
          Field: '@/admin/components/WorkflowPanel',
        },
      },
    },
  ],
}
