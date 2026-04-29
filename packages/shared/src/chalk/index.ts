// oxlint-disable no-console
import chalk from 'chalk'

export const warning = chalk.yellow
export const error = chalk.red
export const success = chalk.green

export function log(...args: any[]) {
  console.log(...args)
}
log.warning = (message: string) => {
  console.log(warning(message))
}
log.error = (message: string) => {
  console.log(error(message))
}
log.success = (message: string) => {
  console.log(success(message))
}
