import { execSync } from 'node:child_process'

execSync('tm set packages/defaultTemplates/service service')
execSync('tm set packages/defaultTemplates/pinia pinia')
execSync('tm set packages/defaultTemplates/redux redux')
execSync('tm set packages/defaultTemplates/vuex vuex')
execSync('tm set packages/defaultTemplates/zustand zustand')
