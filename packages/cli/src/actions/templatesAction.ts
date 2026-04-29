import { log } from '@tmes/shared'
import templates from '@tmes/templates' with { type: 'json' }

export function getListActions() {
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]!

    const templateName = template.name
    const templatePath = template.path.slice(2)

    log(templateName.padEnd(20, '-'), templatePath)
  }
}
