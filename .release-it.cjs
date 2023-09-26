const version = '${version}'
const packageName = process.env.npm_package_name
// const scope = packageName.split('/')[1]
const scope = packageName

module.exports = {
  plugins: {
    '@release-it/conventional-changelog': {
      path: '.',
      infile: 'CHANGELOG.md',
      preset: 'conventionalcommits',
      types: [
        {
          type: 'feat',
          section: 'Features',
        },
        {
          type: 'fix',
          section: 'Bug Fixes',
        },
        {
          type: 'perf',
          section: 'Performance Improvements',
        },
        {
          type: 'docs',
          section: 'Documentation',
        },
      ],
      gitRawCommitsOpts: {
        path: '.',
      },
    },
  },
  git: {
    push: true,
    requireBranch: 'master',
    tagName: `${scope}-v${version}`,
    tagMessage: `${scope}-v${version}`,
    tagAnnotation: `Release ${scope} v${version}`,
    commitMessage: `chore(${scope}): v${version}`,
    commitArgs: ['--no-verify'],
    commitsPath: '.',
  },
  npm: {
    publish: true,
    versionArgs: ['--workspaces false'],
  },
  github: {
    release: true,
    releaseName: `${packageName}-v${version}`,
  },
  hooks: {
    'after:@release-it/conventional-changelog:beforeRelease': 'prettier --write CHANGELOG.md',
  },
}
