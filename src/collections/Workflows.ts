import { User } from '@/payload-types'
import { runWorkflow } from '@/workflow/workflowEngine'
import { CollectionConfig } from 'payload'

type UserRole = 'admin' | 'reviewer' | 'manager'

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

  endpoints: [
    {
      path: '/action',
      method: 'post',
      handler: async (req) => {
        const payload = req.payload

        const { documentId, collectionSlug, action, comment } = await req.json!()

        if (!documentId || !collectionSlug || !action) {
          return Response.json(
            { error: 'documentId, collectionSlug and action required' },
            { status: 400 },
          )
        }

        // find latest pending step
        const logs = await payload.find({
          collection: 'workflowLogs',
          where: {
            and: [
              {
                documentId: {
                  equals: String(documentId),
                },
              },
              {
                action: {
                  equals: 'pending',
                },
              },
            ],
          },
          sort: '-timestamp',
          limit: 1,
          depth: 0,
        })

        const currentStep = logs.docs[0]

        if (!currentStep) {
          return Response.json({ error: 'No pending step found' }, { status: 404 })
        }

        // get workflow to check assigned role
        const workflow = await payload.findByID({
          collection: 'workflows',
          id: currentStep.workflow as number,
        })

        const step = workflow.steps[currentStep.stepOrder]

        const assignedRole = step?.assignedRole
        const assignedUser = step?.assignedUser

        // check role permission
        if (assignedRole && req.user?.role !== assignedRole && req.user?.id !== assignedUser) {
          return Response.json(
            { error: 'You are not allowed to approve this step' },
            { status: 403 },
          )
        }
        // update log entry
        await payload.update({
          collection: 'workflowLogs',
          id: currentStep.id,
          data: {
            action,
            comment: comment || '',
            user: req.user?.id,
            role: req.user?.role,
          },
        })

        // get document again
        const doc = await payload.findByID({
          collection: collectionSlug,
          id: documentId,
        })

        // run workflow again to move next step
        const { runWorkflow } = await import('@/workflow/workflowEngine')

        await runWorkflow({
          payload,
          collectionSlug,
          document: doc,
        })

        return Response.json({
          success: true,
          message: `Step ${action}`,
        })
      },
    },
    {
      path: '/trigger',
      method: 'post',
      handler: async (req) => {
        const payload = req.payload

        const { collectionSlug, documentId } = await req.json!()

        if (!collectionSlug || !documentId) {
          return Response.json({ error: 'collectionSlug and documentId required' }, { status: 400 })
        }

        const doc = await payload.findByID({
          collection: collectionSlug,
          id: documentId,
        })

        if (!doc) {
          return Response.json({ error: 'Document not found' }, { status: 404 })
        }

        await runWorkflow({
          payload,
          collectionSlug,
          document: doc,
        })

        return Response.json({ message: 'Workflow triggered' })
      },
    },
    {
      path: '/status/:docId',
      method: 'get',
      handler: async (req) => {
        const payload = req.payload

        const docId = req.routeParams?.docId

        if (!docId) {
          return Response.json({ error: 'Document ID is required' }, { status: 400 })
        }

        let logs = await payload.find({
          collection: 'workflowLogs',
          where: {
            documentId: {
              equals: docId,
            },
          },
          sort: '-timestamp',
        })

        return Response.json({
          success: true,
          logs: logs.docs,
        })
      },
    },
  ],

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
          required: true,
        },
        {
          name: 'stepType',
          type: 'select',
          options: ['approval', 'review', 'sign-off', 'comment-only'],
          required: true,
        },
        {
          name: 'assignedRole',
          type: 'text',
          required: true,
        },
        {
          name: 'assignedUser',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'condition',
          type: 'text',
          required: true,
        },
        {
          name: 'slaHours',
          type: 'number',
        },
      ],
    },
  ],
}
