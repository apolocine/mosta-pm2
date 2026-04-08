// @mostajs/pm2 — Module registration
// Author: Dr Hamid MADANI drmdh@msn.com

import { moduleInfo, getSchemas } from './lib/module-info.js'

export const pm2Registration = {
  name: moduleInfo.name,
  label: moduleInfo.label,
  description: moduleInfo.description,
  version: moduleInfo.version,
  priority: 60,
  getSchemas,
}
