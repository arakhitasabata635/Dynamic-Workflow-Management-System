import { CollectionConfig } from 'payload'

export const WorkflowLogs: CollectionConfig = {
  slug: 'workflowLogs',

  access: {
    update: () => true,
    delete: () => false,
  },

  fields: [
    {
      name: 'workflow',
      type: 'relationship',
      relationTo: 'workflows',
      required: true,
    },
    {
      name: 'collectionSlug',
      type: 'text',
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
    {
      name: 'stepName',
      type: 'text',
      required: true,
    },
    {
      name: 'stepOrder',
      type: 'number',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'role',
      type: 'text',
    },
    {
      name: 'action',
      type: 'select',
      options: ['pending', 'approved', 'rejected', 'comment'],
      required: true,
      defaultValue: 'pending',
    },
    {
      name: 'comment',
      type: 'textarea',
    },
    {
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date(),
      required: true,
    },
  ],
}
