# Flatfile Platform SDK

The Flatfile Platform SDK lets developers control all aspects of the flatfile experience with code deployed through familiar workflows.

The SDK configures Workspaces, SheetTemplates (analogous to tables in a DB), fields, and Data Hooks.

Tests for the SDK are written with our custom helpers that minimize boilerplate and clearly show behavior of different configuration. As you customize your installation, you should write tests yourself to figure out how flatfile handles different data configurations.

[Example test](src/examples/Schematest.spec.ts)

## Getting started

```bash
$ git clone git@github.com:FlatFilers/Mono.git
$ cd Mono
$ git checkout feature/data-abstraction-extract
$ cd core/platform-sdk
$ npm install
$ npm run build && npm run test
```
