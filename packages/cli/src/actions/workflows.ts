import process from 'node:process'
import { isExisting, join, mkdir, writeFile } from '@tm/utils'

export function createNodeVersion(cwd: string) {
  const nodeVersion = join(cwd, '.node-version')
  if (isExisting(nodeVersion))
    return

  writeFile(nodeVersion, process.version.slice(1))
}

export function createWorkflow(cwd: string, fileName: string, workflow: string) {
  if (workflow.includes('.node-version')) {
    createNodeVersion(cwd)
  }

  if (!fileName.endsWith('.yml')) {
    fileName += '.yml'
  }

  const githubPath = join(cwd, '.github')
  if (!isExisting(githubPath)) {
    mkdir(githubPath)
  }

  const workflowsPath = join(githubPath, 'workflows')
  if (!isExisting(workflowsPath)) {
    mkdir(workflowsPath)
  }

  writeFile(join(cwd, '.github', 'workflows', fileName), workflow, { flag: 'w' })
}
