import { platform } from 'node:os'

export function isWin(): boolean {
  return platform() === 'win32'
}

export const pnpm = isWin() ? 'pnpm.cmd' : 'pnpm'
