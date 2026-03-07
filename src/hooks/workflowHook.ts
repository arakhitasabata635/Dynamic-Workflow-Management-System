import { runWorkflow } from '@/workflow/workflowEngine'

export const workflowHook = async ({ req, doc, collection, operation }: any) => {
  if (!req?.payload) return

  if (operation === 'create' || operation === 'update') {
    await runWorkflow({
      payload: req.payload,
      collectionSlug: collection.slug,
      document: doc,
    })
  }
}
