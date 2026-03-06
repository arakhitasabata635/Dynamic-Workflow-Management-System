import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Reviewer', value: 'reviewer' },
        { label: 'Manager', value: 'manager' },
      ],
      defaultValue: 'reviewer',
    },
  ],
}
