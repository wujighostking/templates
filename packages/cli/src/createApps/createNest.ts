import { createTemplate } from './creator.ts'

export async function createNestApp(options: { name: string }) {
  await createTemplate('nest', options.name)
}
