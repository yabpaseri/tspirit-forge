# Development

TSpirit Forge の開発者向けメモです。

## 前提

- Bun
- Chromium 系ブラウザ、または Firefox

## セットアップ

```bash
bun install
```

## ビルド

### Chromium 系ブラウザ向け

```bash
bun run build
```

ビルド後、`.output/chrome-mv3` を拡張機能として読み込めます。

### Firefox 向け

```bash
bun run build:firefox
```

## zip 生成

```bash
bun run zip
bun run zip:firefox
```

## よく使うスクリプト

```bash
bun run build
bun run build:firefox
bun run compile
bun run lint
bun run lint:fix
bun run format
bun run format:check
```

## 技術スタック

- WXT
- React 19
- TypeScript
- Valibot
- Papa Parse
- dnd-kit
- @wxt-dev/i18n

## 実装メモ

- オプション画面は日本語 / 英語に対応
- アイコンは `assets/icon.svg` から自動生成
- ソート設定の既定値は `utils/sort-rule.ts` で管理
- ソート設定は `utils/vault.ts` でローカルストレージへ保存
