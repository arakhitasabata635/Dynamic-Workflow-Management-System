export const logWorkflowAction = async ({
  payload,
  workflowId,
  documentId,
  collectionSlug,
  stepName,
  userId,
  action,
  comment,
}: {
  payload: any
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
