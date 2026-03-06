import payload from 'payload'

export const logWorkflowAction = async ({
  workflowId,
  documentId,
  collectionSlug,
  stepName,
  userId,
  action,
  comment,
}: {
  workflowId: number
  documentId: string
  collectionSlug: string
  stepName: string
  userId?: number
  action: 'comment' | 'pending' | 'approved' | 'rejected' | null | undefined
  comment?: string
}) => {
  await payload.create({
    collection: 'workflowLogs',
    data: {
      workflow: workflowId,
      documentId,
      collectionSlug,
      stepName,
      user: userId,
      action,
      comment,
    },
  })
}
