#!/usr/bin/env node

import {
  chmod,
  readFile,
  rename,
  stat,
  writeFile,
} from 'node:fs/promises'

const [command, lockPath] = process.argv.slice(2)

if (!['list', 'remove'].includes(command) || !lockPath) {
  console.error('usage: sync-npx-lock.mjs <list|remove> <lock-file>')
  process.exit(2)
}

const sourcePattern = new RegExp(
  String.raw`(?:github\.com[/:])tstelzer/skills(?:\.git)?(?:$|[/#?])`,
)

const isMatchingEntry = (entry) => {
  if (!entry || typeof entry !== 'object') return false

  const source = String(entry.source ?? '').toLowerCase()
  if (source === 'tstelzer/skills') return true

  return [entry.sourceUrl, entry.sourceBaseUrl].some((value) =>
    sourcePattern.test(String(value ?? '').toLowerCase()),
  )
}

let contents
let lock

try {
  contents = await readFile(lockPath, 'utf8')
  lock = JSON.parse(contents)
} catch (error) {
  console.error(`cannot read npx skills lock ${lockPath}: ${error.message}`)
  process.exit(1)
}

if (!lock || typeof lock !== 'object' || !lock.skills) {
  console.error(`invalid npx skills lock: ${lockPath}`)
  process.exit(1)
}

const names = Object.entries(lock.skills)
  .filter(([, entry]) => isMatchingEntry(entry))
  .map(([name]) => name)
  .sort()

if (command === 'list') {
  if (names.length > 0) process.stdout.write(`${names.join('\n')}\n`)
  process.exit(0)
}

for (const name of names) delete lock.skills[name]

if (names.length > 0) {
  const lockStat = await stat(lockPath)
  const temporaryPath = `${lockPath}.tstelzer-skills-${process.pid}`
  const updated = `${JSON.stringify(lock, null, 2)}\n`

  await writeFile(temporaryPath, updated, 'utf8')
  await chmod(temporaryPath, lockStat.mode)
  await rename(temporaryPath, lockPath)
}

process.stdout.write(String(names.length))
