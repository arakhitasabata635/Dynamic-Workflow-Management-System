'use client'
import React, { useEffect, useState } from 'react'
import { useDocumentInfo, useAuth } from '@payloadcms/ui'

const WorkflowPanel: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const { user } = useAuth()

  const [workflow, setWorkflow] = useState<any>(null)

  const fetchStatus = async () => {
    if (!id) return

    const res = await fetch(`/api/workflows/status/${id}`)
    const data = await res.json()

    setWorkflow(data)
  }

  useEffect(() => {
    fetchStatus()
  }, [id])

  const handleAction = async (action: string) => {
    const comment = prompt('Optional comment')

    await fetch('/api/workflows/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: id,
        collectionSlug,
        action,
        comment,
      }),
    })

    await fetchStatus()
  }

  if (!workflow) return null
  console.log(workflow)

  return (
    <div style={{ padding: 20, borderTop: '1px solid #ddd' }}>
      <h3>Workflow Status</h3>

      <p>
        <strong>Current Step:</strong> {workflow.stepName}
      </p>

      <h4>Steps</h4>

      {workflow.steps?.map((step: any, index: number) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <strong>{step.name}</strong> — {step.status} ({step.role})
        </div>
      ))}

      <h4>Logs</h4>

      {workflow.logs?.map((log: any) => (
        <div key={log.id} style={{ marginBottom: 10 }}>
          <strong>{log.stepName}</strong> — {log.action}
          {log.user && <span> by {log.user.email}</span>}
          {log.comment && <p>Comment: {log.comment}</p>}
        </div>
      ))}

      <h4>Actions</h4>
      {}

      <button onClick={() => handleAction('approved')}>Approve</button>

      <button onClick={() => handleAction('rejected')} style={{ marginLeft: 10 }}>
        Reject
      </button>

      <button onClick={() => handleAction('comment')} style={{ marginLeft: 10 }}>
        Comment
      </button>
    </div>
  )
}

export default WorkflowPanel
