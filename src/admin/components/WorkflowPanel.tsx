'use client'
import React, { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

const WorkflowPanel: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  console.log('this page is created and updated')
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    if (!id) return

    const fetchStatus = async () => {
      const res = await fetch(`/api/workflows/status/${id}`)
      const data = await res.json()

      setLogs(data.logs || [])
    }

    fetchStatus()
  }, [id])

  return (
    <div style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
      <h3>Workflow Status</h3>

      {logs.length === 0 && <p>No workflow logs yet.</p>}

      {logs.map((log) => (
        <div key={log.id} style={{ marginBottom: '10px' }}>
          <strong>{log.stepName}</strong> — {log.action}
          {log.comment && <p>Comment: {log.comment}</p>}
        </div>
      ))}
    </div>
  )
}

export default WorkflowPanel
