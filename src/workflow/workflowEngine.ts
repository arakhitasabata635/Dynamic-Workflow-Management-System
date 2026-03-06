import payload from 'payload'
import { logWorkflowAction } from './workflowLogger'
import { evaluateCondition } from './conditionEvaluator'

type WorkflowContentType = 'blogs' | 'contracts'

export const runWorkflow = async ({
  collectionSlug,
  document,
}: {
  collectionSlug: string
  document: any
}) => {
  try {
    console.log('Running workflow for:', collectionSlug, document.documentId)

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
        documentId: { equals: document.documentId },
      },
      sort: '-createdAt',
    })

    if (logs.docs[0].action === 'pending' || logs.docs[0].action === 'rejected') return

    let nextIndex = 0
    //check the log is present or not
    if (logs.docs.length !== 0) {
      const stepCompleted = logs.docs[0].stepName

      for (const step of workflow.steps) {
        if (step.stepName !== stepCompleted) {
          nextIndex++
          continue
        }
        if (!evaluateCondition(step.condition, document.amount)) {
          nextIndex++
          continue
        }

        nextIndex++
        break
      }
    } else {
      for (const step of workflow.steps) {
        if (!evaluateCondition(step.condition, document.amount)) {
          nextIndex++
          continue
        }
        nextIndex++
        break
      }
    }

    const nextStep = workflow.steps[nextIndex].stepName
    const assignRole = workflow.steps[nextIndex].assignedRole

    console.log(`Step triggered: ${nextStep}`)
    console.log(`Assigned Role: ${assignRole}`)

    // simulate email notification
    console.log(`Notification sent to ${assignRole}`)

    await logWorkflowAction({
      workflowId: workflow.id,
      documentId: document.documentId,
      collectionSlug,
      stepName: nextStep || '',
      action: 'step_triggered',
    })
  } catch (error) {
    console.error('Workflow engine error:', error)
  }
}

function checkStepIsComplited() {}
