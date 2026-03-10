import { workflowHook } from '@/hooks/workflowHook'
import { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  access: {},
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
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'amount',
      type: 'number',
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
