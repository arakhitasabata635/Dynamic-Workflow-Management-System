'use client'
import React, { useEffect, useState } from 'react'
import { useDocumentInfo, useAuth } from '@payloadcms/ui'

const WorkflowPanel: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const { user } = useAuth()

  const [logs, setLogs] = useState<any>(null)

  const fetchStatus = async () => {
    if (!id) return

    const res = await fetch(`/api/workflows/status/${id}`)
    const data = await res.json()

    setLogs(data.logs[0])
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

  if (!logs) return <div>Loading workflow...</div>

  return (
    <div style={{ padding: 20, borderTop: '1px solid #221d1d' }}>
      <h3>Workflow Progress</h3>

      <p>
        <strong>Current Step:</strong> {logs.stepName}
      </p>

      <h4>Steps</h4>

      {logs?.workflow?.steps?.map((step: any, index: number) => {
        const isCurrent = logs.stepName === step.stepName

        return (
          <div
            key={step.id}
            style={{
              border: '1px solid #eee',
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              background: isCurrent ? '#4b4949' : '#161212',
            }}
          >
            <strong>{step.stepName}</strong>

            <div>Role: {step.assignedRole}</div>

            {isCurrent && (
              <>
                <div>Status: {logs.action}</div>

                <div>Time: {new Date(logs.timestamp).toLocaleString()}</div>

                {logs.user && <div>User: {logs.user.email}</div>}

                {logs.comment && <div>Comment: {logs.comment}</div>}
              </>
            )}

            {user?.role === step.assignedRole && isCurrent && (
              <div style={{ marginTop: 10 }}>
                <button onClick={() => handleAction('approved')}>Approve</button>

                <button onClick={() => handleAction('rejected')} style={{ marginLeft: 10 }}>
                  Reject
                </button>

                <button onClick={() => handleAction('comment')} style={{ marginLeft: 10 }}>
                  Comment
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default WorkflowPanel
