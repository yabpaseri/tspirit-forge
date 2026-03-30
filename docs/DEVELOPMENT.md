# Development

Developer notes for TSpirit Forge.

## Prerequisites

- Bun
- A Chromium-based browser or Firefox

## Setup

```bash
bun install
```

## Build

### Chromium

```bash
bun run build
```

After building, load `.output/chrome-mv3` as an unpacked extension.

### Firefox

```bash
bun run build:firefox
```

## Creating a zip

```bash
bun run zip
bun run zip:firefox
```

## Common Scripts

```bash
bun run build
bun run build:firefox
bun run compile
bun run lint
bun run lint:fix
bun run format
bun run format:check
```

## Tech Stack

- WXT
- React 19
- TypeScript
- Valibot
- Papa Parse
- dnd-kit
- @wxt-dev/i18n

## Implementation Notes

- The options page supports Japanese and English
- Icons are auto-generated from `assets/icon.svg`
- Default sort rules are managed in `utils/sort-rule.ts`
- Sort settings are persisted to local storage via `utils/vault.ts`
