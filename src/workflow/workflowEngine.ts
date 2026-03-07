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
    console.log('logs', typeof document.id)
    if (logs.docs[0]?.action === 'pending' || logs.docs[0]?.action === 'rejected') return

    //find the new step index
    let nextIndex = 0

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
        break
      }
    } else {
      for (const step of workflow.steps) {
        console.log('step', !evaluateCondition(step.condition, document.amount))
        if (!evaluateCondition(step.condition, document.amount)) {
          nextIndex++
          continue
        }
        break
      }
    }
    console.log(nextIndex)

    // is next step is present or not
    const nextStepObj = workflow.steps[nextIndex]

    if (!nextStepObj) {
      console.log('Workflow finished')
      return
    }

    const nextStep = nextStepObj.stepName

    console.log('nextStep', nextStep)
    if (nextStep) {
      const assignRole = workflow.steps[nextIndex].assignedRole

      console.log(`Step triggered: ${nextStep}`)
      console.log(`Assigned Role: ${assignRole}`)

      // simulate email notification
      console.log(`Notification sent to ${assignRole}`)

      await logWorkflowAction({
        payload: payload,
        workflowId: workflow.id,
        documentId: document.id,
        collectionSlug,
        stepName: nextStep || '',
        action: 'pending',
      })
    } else {
      console.log('all are approved')
    }
  } catch (error) {
    console.error('Workflow engine error:', error)
  }
}
