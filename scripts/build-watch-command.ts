/* eslint-disable no-console,security/detect-non-literal-fs-filename */
import { watch } from 'node:fs'
import { resolve } from 'node:path'
import build from './build'

const srcDir = resolve(import.meta.dir, '../src')

try {
  console.info('Building...')
  await build()
  console.info('Watching for changes...')
} catch (error) {
  console.error('Failed to build', error)
}

const watcher = watch(srcDir, { recursive: true }, () => {
  console.info('Rebuilding...')
  build()
    .then(() => {
      console.info('Watching for changes...')

      return null
    })
    .catch(error => {
      console.error('Failed to build', error)
    })
})

process.on('SIGINT', () => {
  // close watcher when Ctrl-C is pressed
  console.log('Closing watcher...')
  watcher.close()

  process.exit(0)
})
