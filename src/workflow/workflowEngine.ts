import { logWorkflowAction } from './WorkflowLogs'
import { evaluateCondition } from './conditionEvaluator'

export const runWorkflow = async ({ payload, collectionSlug, document }: any) => {
  try {
    console.log('Running workflow for:', collectionSlug, document.id)

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
        documentId: { equals: document.id },
      },
      sort: '-timestamp',
    })

    if (
      logs.docs[0]?.action === 'pending' ||
      logs.docs[0]?.action === 'rejected' ||
      logs.docs[0]?.action === 'comment'
    )
      return

    //find the new step index
    let nextIndex = calculateNextIndex(logs, workflow, document)

    // if step completed
    const nextStepObj = workflow.steps[nextIndex]
    console.log('nextIndex', nextIndex)
    if (!nextStepObj) {
      console.log('Workflow completed for document:', document.id)
      return
    }

    //if step present
    console.log(`Step triggered: ${nextStepObj.stepName}`)

    // simulate email notification
    console.log(`Notification sent to assigned user or role`)

    await logWorkflowAction({
      payload,
      workflowId: workflow.id,
      documentId: String(document.id),
      collectionSlug,
      stepName: nextStepObj.stepName,
      role: nextStepObj.assignedRole,
      stepOrder: nextIndex,
      action: 'pending',
    })
  } catch (error) {
    console.error('Workflow engine error:', error)
  }
}

function calculateNextIndex(logs: any, workflow: any, document: any): number {
  // find approved steps
  let nextIndex = logs.docs[0]?.stepOrder || 0

  // skip steps if condition fails
  while (nextIndex < workflow.steps.length) {
    const step = workflow.steps[nextIndex]

    const conditionValid = evaluateCondition(step.condition, document)

    if (conditionValid) {
      break
    }

    nextIndex++
  }
  console.log('nextIndex', nextIndex)
  return nextIndex
}
