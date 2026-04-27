import { createTemplate } from './creator.ts'

export function createNuxtApp(options: { name: string }) {
  createTemplate('nuxt', options.name)
}
