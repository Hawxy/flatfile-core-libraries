# @flatfile/configure

## 0.5.0

### Minor Changes

- 8d642d4: adds makeField to enable well typed extended fields

### Patch Changes

- Updated dependencies [8d642d4]
  - @flatfile/schema@0.2.6

## 0.4.10

### Patch Changes

- 48a118c: Cleanup

## 0.4.9

### Patch Changes

- e258f27: Adds ability to export SchemaIL Model to Blueprint SheetConfig
- 745a73e: XDK publishing
- Updated dependencies [e258f27]
- Updated dependencies [745a73e]
  - @flatfile/schema@0.2.4
  - @flatfile/hooks@1.2.1

## 0.4.8

### Patch Changes

- dc57b64: feat: improvements to egressFormat, specifically that allow true date comparisons in verify egressCycle

## 0.4.7

### Patch Changes

- ad818ee: feat: initial implementation of GroupByField, and sheetCompute infrastructure on top of sheet
- Updated dependencies [ad818ee]
  - @flatfile/schema@0.2.3

## 0.4.6

### Patch Changes

- 692d4c7: Resolving an issue where required fields ended up with multiple errors

## 0.4.5

### Patch Changes

- f10d51a: feat: adds egressFormat hook to control final to text conversion of a field in an explicit step

## 0.4.4

### Patch Changes

- 6776dde: chore: throw a clear error message when a LinkedField is used without a sheet specified

## 0.4.3

### Patch Changes

- fad3d6e: feat: add CompositeField feature which enables ddl handling of multiple fields in one reusable component

## 0.4.2

### Patch Changes

- 1d0e3d9: Adding matchStrategy to enum to allow exact only matches. and upsert:false to LinkedField to better control upsert behavior
- Updated dependencies [1d0e3d9]
  - @flatfile/schema@0.2.2

## 0.4.1

### Patch Changes

- f47369c: Fixes allowCustomFields feature from the platform-sdk
- Updated dependencies [f47369c]
  - @flatfile/schema@0.2.1

## 0.4.0

### Minor Changes

- 66c193c: Adds Annotations

### Patch Changes

- Updated dependencies [66c193c]
  - @flatfile/schema@0.2.0

## 0.3.6

### Patch Changes

- 5daab1b: Adjust Validate Hook messages to set Info level messages instead of Error
- f77b422: Adds Logger and Session to recordCompute() functions
- 0bb3cbc: Add Portal Deploys via SDK
- Updated dependencies [0d047e6]
  - @flatfile/schema@0.1.4

## 0.3.5

### Patch Changes

- 672a52e: Bugfixes around validate and defaults on OptionField

## 0.3.4

### Patch Changes

- 59cdb30: Bump @flatfile/schema version

## 0.3.3

### Patch Changes

- 9df81f1: Added DateField and batchRecordsCompute

## 0.3.2

### Patch Changes

- ed38f4f: Refactor internals and add CategoryField

## 0.3.1

### Patch Changes

- 7684411: fix: declaring label and options on a field
- Updated dependencies [7684411]
  - @flatfile/schema@0.1.1

## 0.3.0

### Minor Changes

- 744bc73: Make field hooks synchronous

## 0.2.0

### Minor Changes

- efe44a0: @paddymulrenamed hooks onCast -> cast, onEmpty -> empty, onValue -> compute, o…6ec5414…nValidate -> validate

## 0.1.1

### Patch Changes

- 1ba90f5: Fix: Adds labels back in to Fields when exporting from SchemaIL

## 0.1.0

### Minor Changes

- 5819944: Alpha base functionality

### Patch Changes

- Updated dependencies [5819944]
  - @flatfile/orm@0.1.0
  - @flatfile/schema@0.1.0
