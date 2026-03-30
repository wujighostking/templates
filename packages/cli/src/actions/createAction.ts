interface Options {
  name: string
}

export function createAction(options: Options) {}

export function normaizeName(name: string | Options): Options {
  if (typeof name === 'object') {
    return name
  }

  return {
    name,
  }
}
