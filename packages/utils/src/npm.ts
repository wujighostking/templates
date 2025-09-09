import * as os from 'node:os'

export function platform(npm: string) {
  return os.platform() === 'win32' ? `${npm}.cmd` : npm
}

export const pnpm = platform('pnpm')
