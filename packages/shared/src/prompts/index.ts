import {
  CANCEL_SYMBOL,
  confirm,
  select,
  text,
  multiselect,
  isCancel as _isCancel,
  type SelectOptions,
  type TextOptions,
  type MultiSelectOptions,
} from '@clack/prompts'

import { exit } from '..'

type CancelSymbol = typeof CANCEL_SYMBOL

export const shouldContinue = async (
  message: string,
  initialValue?: boolean,
): Promise<boolean | CancelSymbol> =>
  await confirm({ message, initialValue: initialValue ?? false, inactive: '否', active: '是' })

export const isCancel = (value: unknown, code?: number) => {
  _isCancel(value) && exit(code ?? 0)

  return false
}

export const getValue = async (options: TextOptions): Promise<string | CancelSymbol> =>
  await text(options)

export const getSelectedValue = async <T = unknown>(
  options: SelectOptions<T>,
): Promise<T | CancelSymbol> => await select(options)

export const getMultiSelectedValue = async <T = unknown>(
  options: MultiSelectOptions<T>,
): Promise<T[] | CancelSymbol> => await multiselect(options)
