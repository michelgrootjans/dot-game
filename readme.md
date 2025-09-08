# The agile dot game

This is an online simulation of the agile dot game

# Play the game

Go to https://afternoon-bayou-75731.herokuapp.com/

# Progress

see https://github.com/michelgrootjans/dot-game/projects/2

# How I use it during a workshop

## Introduction

Demo the simulation on a test project first.
Show every person's task in the workflow.

Once the demo is over, ask the audience to estimate the average task in seconds.

## The workshop

We're going to run a number of iterations:

### Push Batches of 4

Process for each participant

1. Wait for a batch of 4 items to appear in their inbox
2. They take exactly 4 items in their workspace
3. They solve the 4 items
4. Move the 4 items to their outbox
5. go to 1.

### Push Piece by piece

Process for each participant

1. Wait for an item to appear in their inbox
2. They take exactly 1 items in their workspace
3. They solve the item
4. Move the item to their outbox
5. go to 1.

### Pull Batches of 4

Process for each participant

1. Wait for a batch of 4 items to appear in their inbox
2. They take exactly 4 items in their workspace
3. They solve the 4 items
4. They move the 4 solved items only if their outbox is empty
5. go to 1.

### Pull Piece by piece

Process for each participant

1. Wait for an item to appear in their inbox
2. They take exactly 1 items in their workspace
3. They solve the item
4. Move the item to their outbox only if the outbox is empty
5. go to 1.

### Limit total WIP

The Product owner creating the items cannot go over a total WIP of 10.
Everyone else works on one item at a time without the previous constraints.

### Drum buffer rope

The Product owner creating the items tries to keep the inbox of development populated to 2 items.
Everyone else works on one item at a time without the previous constraints.

## Some observations

- There is no correlation between _Effort_ and _When will it be done?_
  - The nature of the work never changed
  - The effort required to do each task was equal in all iterations
  - The time it took for a single story to be _done_ (lead time) was wildly different in each iteration.

## Things not included in the simulation, but can actually improve effectiveness

- Parallel work with integration at the end of the process
- Collaboration: swarming, pair programming, ensemble programming
- Variability of work: some items might be analysis heavy, others QA-heavy
- ... probably more

# Run it locally

run the following commands in two separate terminals:

- `npm run serverstart`
- `npm run webpack:watch`

`open localhost:3000`

There are a few scripts to simulate iterations. They require curl to be installed (which is usually pre-installed on most systems).
- `./scripts/simple_scenario.sh` - A simple predefined scenario
- `./scripts/work_hard.sh` - Workers process tasks in parallel
  - Optional parameter: `TIME=30` (default: 60) - Sets the simulation duration in seconds
  - Example: `./scripts/work_hard.sh TIME=30`
- `./scripts/limit_wip.sh` - Workers process tasks in parallel with a WIP limit
  - Optional parameters: 
    - `WIP=5` (default: 10) - Sets the work-in-progress limit
    - `TIME=30` (default: 60) - Sets the simulation duration in seconds
  - Example: `./scripts/limit_wip.sh WIP=5 TIME=30`

## Run the tests

`npm run test`

`npm run test:watch`

## Format files

`npm run format`

# TypeScript Migration

This project is being gradually migrated to TypeScript. The setup allows for a smooth transition where JavaScript and TypeScript files can coexist.

## TypeScript Setup

The project has been configured with:
- TypeScript compiler (`tsconfig.json`)
- Webpack support for TypeScript files
- Source maps for debugging
- Scripts for building and developing with TypeScript

## Running with TypeScript

To build the project with TypeScript:
```
npm run build
```

For development with TypeScript (runs TypeScript compiler, webpack, and server in watch mode):
```
npm run dev
```

To run just the TypeScript compiler:
```
npm run tsc
```

To run the TypeScript compiler in watch mode:
```
npm run tsc:watch
```

## Migration Guidelines

When migrating JavaScript files to TypeScript:

1. **Create a new file**: Create a `.ts` file alongside the existing `.js` file.
   - Example: `API.js` → `API.ts`

2. **Add type annotations**: Start by adding basic type annotations and interfaces.
   - Use `any` type initially if the exact type is unclear
   - Gradually refine types as you understand the code better

3. **Module compatibility**: 
   - When migrating CommonJS modules to TypeScript, maintain separate implementations for ES modules and CommonJS compatibility:
     1. TypeScript file (e.g., `API.ts`) should use only ES module syntax:
        ```typescript
        // Export for ES modules only
        export default API;
        ```
     2. Keep the original JavaScript file (e.g., `API.js`) with a direct implementation using CommonJS:
        ```javascript
        // Direct implementation for CommonJS compatibility
        const API = (gameId) => {
          // Implementation details...
        };
        
        // Export for CommonJS
        module.exports = API;
        ```
   - This approach is more reliable than trying to have one file import from the other
   - It avoids issues with webpack's module system by keeping a clean separation between module systems
   - Existing JavaScript files can continue to use `require('./API')` and will get the CommonJS version
   - TypeScript files can use `import from './API'` and get the ES module version
   - Keep both implementations in sync when making changes

4. **Testing**: 
   - Ensure the TypeScript version works correctly before removing the JavaScript version
   - After making changes to module exports, always rebuild with `npm run build` and test in the browser
   - Check both ES module imports and CommonJS requires to ensure compatibility

5. **Incremental adoption**: Focus on one module at a time, starting with simpler, less-connected modules.

## TypeScript Conventions

- Use interfaces for object shapes
- Prefer explicit return types on functions
- Use `type` for unions, intersections, and aliases
- Keep the `strict` mode disabled during migration to reduce friction
- Use source maps for debugging

## Dependency Constraints

- `ts-jest@27.1.5` requires `@types/jest@^27.0.0` as a peer dependency
- `ts-jest@27.1.5` requires `typescript@>=3.8 <5.0` as a peer dependency
- Do not upgrade `@types/jest` beyond version 27.x without also upgrading `ts-jest`
- Do not upgrade `typescript` to version 5.x without also upgrading `ts-jest`
- If you encounter dependency conflicts during installation, you may need to use `--legacy-peer-deps` flag

# License

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
