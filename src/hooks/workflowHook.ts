import { runWorkflow } from '@/workflow/workflowEngine'

export const workflowHook = async ({ req, doc, collection }: any) => {
  await runWorkflow({
    payload: req.payload,
    collectionSlug: collection.slug,
    document: doc,
  })
}
