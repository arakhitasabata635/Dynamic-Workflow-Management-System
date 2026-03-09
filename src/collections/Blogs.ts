import { workflowHook } from '@/hooks/workflowHook'
import { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',

  admin: {
    useAsTitle: 'title',
    components: {
     afterList: ['@/admin/components/WorkflowPanel']
    },
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
  ],
}
