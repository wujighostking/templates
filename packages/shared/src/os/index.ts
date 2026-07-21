import { platform, EOL as _EOL } from 'node:os'

export function isWin(): boolean {
  return platform() === 'win32'
}

export const pnpm = isWin() ? 'pnpm.cmd' : 'pnpm'

export const EOL = _EOL

export const exit = process.exit
