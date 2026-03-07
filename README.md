# Dynamic Workflow Management System – Payload CMS

## Overview

This project implements a **Dynamic Workflow Management System** built with **Payload CMS v2, TypeScript, and PostgreSQL**.
It allows administrators to create configurable workflows with multiple approval steps that can be attached dynamically to any collection.

The system supports document approval pipelines such as:

- Blog publishing workflows
- Contract approval workflows
- Multi-stage document review processes

Each workflow contains multiple steps that can be assigned to **roles or specific users**, and the system automatically evaluates and triggers workflow progression when documents are created or updated.

---

# Features

## Dynamic Workflow Engine

- Admins can create workflows from the admin UI.
- Workflows support **unlimited steps**.
- Each step includes:
  - Step name
  - Step type (approval / review / sign-off / comment-only)
  - Assigned role or assigned user
  - Optional condition
  - SLA hours (optional)

Workflow execution is triggered automatically whenever a document is created or updated.

---

## Supported Workflow Step Types

| Step Type    | Description                               |
| ------------ | ----------------------------------------- |
| approval     | Requires approval from assigned user/role |
| review       | Review step before approval               |
| sign-off     | Final confirmation step                   |
| comment-only | Informational step allowing comments      |

---

## Audit Trail System

All workflow activities are stored in an immutable audit log collection.

Each log records:

- Workflow ID
- Document ID
- Collection name
- Step name
- User performing the action
- Action type (pending / approved / rejected / comment)
- Timestamp
- Optional comments

Logs cannot be edited or deleted.

---

## Admin Workflow Panel

A workflow panel is injected into the document edit page in the admin UI.

This panel displays:

- Workflow progress
- Step history
- User actions
- Approval status

Admins and reviewers can see the workflow state directly inside the document editor.

---

## REST APIs

Two custom API endpoints are provided.

### Trigger Workflow

POST

```
/api/workflows/trigger
```

Body example:

```
{
  "collectionSlug": "contracts",
  "documentId": "1"
}
```

This endpoint manually triggers workflow evaluation.

---

### Get Workflow Status

GET

```
/api/workflows/status/:docId
```

Example:

```
/api/workflows/status/1
```

Returns the workflow logs for a document.

---

# Project Architecture

## Folder Structure

```
src
│
├── collections
│   ├── Blogs.ts
│   ├── Contracts.ts
│   ├── Workflows.ts
│   └── WorkflowLogs.ts
│
├── workflow
│   ├── workflowEngine.ts
│   ├── workflowHook.ts
│   ├── conditionEvaluator.ts
│   └── logWorkflowAction.ts
│
├── components
│   └── WorkflowPanel.tsx
│
└── payload.config.ts
```

---

## Core Components

### Workflow Engine

`workflowEngine.ts`

Responsible for:

- Finding workflow configuration
- Evaluating conditions
- Determining the next workflow step
- Logging workflow events
- Triggering notifications

---

### Workflow Hook

`workflowHook.ts`

Runs automatically whenever documents are created or updated.

This hook triggers the workflow engine and determines whether the workflow should move to the next step.

---

### Condition Evaluator

`conditionEvaluator.ts`

Evaluates workflow conditions such as:

```
> 10000
< 5000
>= 2000
```

These conditions determine whether a workflow step should be triggered.

---

### Workflow Logs

`WorkflowLogs.ts`

Stores immutable logs for:

- workflow progress
- approvals
- comments
- rejections

---

# Sample Workflows

## Blog Publishing Workflow

Step 1
Review by Editor

Step 2
Approval by Admin

Step 3
Final Sign-off

---

## Contract Approval Workflow

Step 1
Legal Review

Condition

```
> 5000
```

Step 2
Manager Approval

Step 3
CEO Sign-off

---

# Setup Instructions

## Prerequisites

- Node.js 18+
- PostgreSQL database (Neon DB supported)

---

## Installation

Clone the repository

```
git clone <private-repo-url>
```

Navigate to project

```
cd workflow-payload-project
```

Install dependencies

```
npm install
```

---

## Environment Variables

Create `.env` file

```
PAYLOAD_SECRET=your_secret_key
DATABASE_URL=your_neon_database_url
```

---

## Run Development Server

```
npm run dev
```

Payload admin will start at

```
http://localhost:3000/admin
```

---

# Seed Data

The project includes example collections:

- Blog
- Contract

Create documents from the admin panel to test workflow execution.

---

# Demo Credentials

Admin User

```
email: admin@example.com
password: admin123
```

Reviewer User

```
email: reviewer@example.com
password: reviewer123
```

These users can be created in the admin interface.

---

# Deployment Guide

## Deploy to Vercel

Install Vercel CLI

```
npm install -g vercel
```

Deploy

```
vercel
```

Add environment variables in the Vercel dashboard:

```
PAYLOAD_SECRET
DATABASE_URL
```

Once deployed, access the admin panel at:

```
https://your-vercel-domain/admin
```

---

# Technical Challenges

## Dynamic Workflow Execution

The biggest challenge was building a workflow engine that dynamically supports multiple collections without hardcoding collection names.

This was solved by:

- Using collectionSlug mapping
- Fetching workflow definitions dynamically
- Executing workflows through reusable hooks

---

## Workflow Logging

Ensuring logs were immutable was important for maintaining a reliable audit trail.

This was implemented by restricting update and delete access on the workflowLogs collection.

---

# Bonus Features

Implemented features beyond the core requirements:

- SLA field for workflow steps
- Condition evaluation system
- Dynamic workflow assignment
- Workflow progress panel in admin UI

---

# Loom Walkthrough

A Loom walkthrough video is included with the submission demonstrating:

- System architecture
- Workflow creation
- Approval process
- API usage
- Admin UI workflow panel
- Deployment demonstration

---

# Author

Backend Developer Assignment Submission

Payload CMS Dynamic Workflow System
