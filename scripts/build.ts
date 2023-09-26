/* eslint-disable no-console */
import path from 'node:path'
import packageJson from '../package.json'

const peerDependencies = Object.keys(packageJson.peerDependencies)

const bytesToKb = (bytes: number) => Number.parseFloat((bytes / 1024).toFixed(2))

const getFileNameFromPath = (filePath: string) => path.basename(filePath)

const bundle = async (minify: boolean) => {
  const build = await Bun.build({
    naming: minify ? '[dir]/[name].min.[ext]' : '[dir]/[name].[ext]',
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    target: 'browser',
    format: 'esm',
    splitting: true,
    sourcemap: 'external',
    minify,
    external: peerDependencies,
    root: './src',
  })

  if (build.success) {
    console.info('Build succeeded:')

    for (const output of build.outputs) {
      const fileName = getFileNameFromPath(output.path)
      const fileSize = bytesToKb(output.size)

      console.info(`- ${fileName} (${fileSize}KB)`)
    }
  } else {
    console.error('Build failed')

    for (const message of build.logs) {
      // Bun will pretty print the message object
      console.error(message)
    }
  }
}

await bundle(false)
await bundle(true)
