# Flatfile CLI

## How to deploy from platform-sdk-mono repo

- setup `platform-sdk-mono/packages/cli/.env` to mirror your flatfile config
- run full build ` platform-sdk-mono $ npm run build`
- run app deploy `platform-sdk-mono $ cd packages/cli &&./dist/index.js publish ../../apps/sandbox/src/setup.ts`
- one line build and deploy `platform-sdk-mono $ npm run build && cd packages/cli &&./dist/index.js publish ../../apps/sandbox/src/setup.ts ; cd ../..`
