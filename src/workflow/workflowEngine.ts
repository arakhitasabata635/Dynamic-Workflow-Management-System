import payload from 'payload'
import { logWorkflowAction } from './workflowLogger'

type WorkflowContentType = 'blogs' | 'contracts'

export const runWorkflow = async ({
  collectionSlug,
  documentId,
}: {
  collectionSlug: string
  documentId: string
}) => {
  try {
    console.log('Running workflow for:', collectionSlug, documentId)

    // 1️⃣ Find workflow for this collection
    const workflows = await payload.find({
      collection: 'workflows',
      where: {
        collectionSlug: {
          equals: collectionSlug,
        },
      },
    })

    const workflow = workflows.docs[0]
    if (!workflow) {
      console.log('No workflow configured for this collection')
      return
    }

    // find logs for this document
    const logs = await payload.find({
      collection: 'workflowLogs',
      where: {
        documentId: { equals: documentId },
      },
      sort: '-createdAt',
    })

    let nextStep

    if (logs.docs.length === 0) {
      // first step
      nextStep = workflow.steps[0]
    } else {
      const lastLog = logs.docs[0]

      const currentIndex = workflow.steps.findIndex((s: any) => s.id === lastLog.id)

      nextStep = workflow.steps[currentIndex + 1]
    }

    if (!nextStep) {
      console.log('Workflow completed')
      return
    }

    console.log('Next step:', nextStep.stepName)

    // log step trigger
    await logWorkflowAction({
      workflowId: workflow.id,
      documentId,
      collectionSlug,
      stepName: nextStep.stepName || '',
      action: 'step_triggered',
    })
  } catch (error) {
    console.error('Workflow engine error:', error)
  }
}
