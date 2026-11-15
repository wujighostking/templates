import { createTemplate } from './creator.ts'

export async function createElectronApp(options: { name: string }) {
  await createTemplate('electron', options.name)
}
