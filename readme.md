# The agile dot game

This is an online simulation of the agile dot game

# Play the game

Go to https://afternoon-bayou-75731.herokuapp.com/

Enter a name for your gamem and you're good to go

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

The following step requires httpie tool to be installed.

`./scripts/simple_scenario.sh`

## Run the tests

`npm run test`

`npm run test:watch`

## Format files

`npm run format`

# License

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
