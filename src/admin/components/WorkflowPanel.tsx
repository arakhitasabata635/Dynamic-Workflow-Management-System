'use client'
import React, { useEffect, useState } from 'react'
import { useDocumentInfo, useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

const WorkflowPanel: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const { user } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<any>(null)

  const fetchStatus = async () => {
    if (!id) return

    const res = await fetch(`/api/workflows/status/${id}`)
    const data = await res.json()
    console.log(data)
    setLogs(data.logs)
  }

  useEffect(() => {
    fetchStatus()
  }, [id])

  const handleAction = async (action: string) => {
    const comment = prompt('Optional comment')

    const response = await fetch('/api/workflows/action', {
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

    if (response.ok) {
      // 3. Force Next.js to refresh the background data
      router.refresh()
      // 4. Update your local component state
      await fetchStatus()
    }
  }

  if (!logs) return null

  return (
    <div style={{ padding: 20, borderTop: '1px solid #221d1d' }}>
      <h3>Workflow Progress</h3>

      <h4>Steps</h4>

      {logs?.map((step: any, index: number) => {
        return (
          <div
            key={step.id}
            style={{
              border: '1px solid #eee',
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              background: index === 0 ? '#4b4949' : '#161212',
            }}
          >
            <strong>{step.stepName}</strong>

            <div>Role: {step.role}</div>

            <div>Status: {step.action}</div>

            <div>Time: {new Date(step.timestamp).toLocaleString()}</div>

            {step.user && <div>User: {step?.user}</div>}

            {step.comment && <div>Comment: {logs.comment}</div>}

            {user?.role === step.role && (
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
