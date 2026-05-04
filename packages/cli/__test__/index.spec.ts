import { spawn } from 'node:child_process'

import { beforeAll, describe, it, expect } from 'vitest'

function hasCli() {
  return new Promise<string>((resolve, reject) => {
    let result = ''
    let errorResult = ''
    const childProcess = spawn('npm.cmd', ['list', '-g', '@tmes/cli'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
    })
    childProcess.stdout?.on('data', (data) => {
      result += data.toString()
    })
    childProcess.stderr?.on('data', (err) => {
      errorResult += err.toString()
    })

    childProcess.on('error', (err) => {
      reject(err)
    })
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result.trim())
        return
      }

      reject(new Error(errorResult))
    })
  })
}

let isInstalled = false
beforeAll(async () => {
  const cli = await hasCli()
  isInstalled = cli.includes('@tmes/cli')
})
describe('cli', () => {
  it('安装 tmes 脚手架', () => {
    expect(isInstalled).toBe(true)
  })
})
