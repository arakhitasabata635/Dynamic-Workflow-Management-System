export const logWorkflowAction = async ({
  payload,
  workflowId,
  documentId,
  collectionSlug,
  stepName,
  stepOrder,
  userId,
  role,
  action,
  comment,
}: {
  payload: any
  workflowId: string | number
  documentId: string
  collectionSlug: string
  stepName: string
  stepOrder: number
  userId?: string | number
  role?: string
  action: 'pending' | 'approved' | 'rejected' | 'comment'
  comment?: string
}) => {
  await payload.create({
    collection: 'workflowLogs',
    data: {
      workflow: workflowId,
      documentId,
      collectionSlug,
      stepName,
      stepOrder,
      user: userId,
      role,
      action,
      comment: comment || '',
    },
  })
}
