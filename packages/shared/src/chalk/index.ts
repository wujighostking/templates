// oxlint-disable no-console
import chalk from 'chalk'

export const warning = chalk.yellow
export const error = chalk.red
export const success = chalk.green

export const log = {
  warning: (message: string) => {
    console.log(warning(message))
  },
  error: (message: string) => {
    console.log(error(message))
  },
  success: (message: string) => {
    console.log(success(message))
  },
}
