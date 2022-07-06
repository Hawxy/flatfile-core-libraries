# Platform SDK

The scaffolding focuses on monorepo tooling and package management and is preconfigured with:

- [Turborepo](https://turborepo.org) - Monorepo build system
- [Changesets](https://github.com/changesets/changesets) - Managing versioning and changelogs
- [GitHub Actions](https://github.com/changesets/action) - Fully automated package publishing
- [Tsup](https://github.com/egoist/tsup) — TypeScript bundler
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io)


TODO
- [] Guidance on hello world setup (can't run npm install)
- []


### Useful Commands

- `npm run build` - Build all packages including the Storybook site
- `npm run dev` - Run all packages locally
- `npm run lint` - Lint all packages
- `npm run changeset` - Generate a changeset
- `npm run clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)


## Versioning & Publishing Packages

Package publishing is automated through changeset and github workflows. To instigate publication:
1. Create a branch and make a change to the `@flatfile/platform-sdk` package 
2. Run `npm run changeset`, choose any package that were modified, and fill out relevent changelog details
3. Push the resulting `.changeset` file along with the package changes from the first step
4. Create PR and merge into main
5. A github action will run and create a new Pull Request with updated changeset additions
6. Merge this new PR
7. A github action will run, build and publish changes to NPM under the package name `@flatfile/platform-sdk`

