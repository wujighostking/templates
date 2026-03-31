import { execa as _execa } from 'execa'
import { type ExecaMethod } from 'execa'

export const execa: ExecaMethod = (...args: any[]) => (_execa as any)(...args)
