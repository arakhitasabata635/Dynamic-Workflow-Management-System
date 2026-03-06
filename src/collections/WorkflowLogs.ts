import { CollectionConfig } from 'payload'

export const WorkflowLogs: CollectionConfig = {
  slug: 'workflowLogs',

  access: {
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'workflow',
      type: 'relationship',
      relationTo: 'workflows',
    },
    {
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'collectionSlug',
      type: 'text',
    },
    {
      name: 'stepName',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'action',
      type: 'select',
      options: ['pending', 'approved', 'rejected', 'comment'],
    },
    {
      name: 'comment',
      type: 'textarea',
    },
    {
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
