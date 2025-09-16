import { execSync } from 'node:child_process'

execSync('tm set packages/defaultTemplates/src/service service')
execSync('tm set packages/defaultTemplates/src/store/pinia pinia')
execSync('tm set packages/defaultTemplates/src/store/redux redux')
execSync('tm set packages/defaultTemplates/src/store/vuex vuex')
execSync('tm set packages/defaultTemplates/src/store/zustand zustand')
