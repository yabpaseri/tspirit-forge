# Chrome Web Store 掲載情報

## 短い説明

### 日本語

TeamSpirit の工数実績ダイアログに CSV 入出力機能を、ジョブアサイン画面にソート・終了ジョブ一括選択機能を追加する非公式拡張です。

### English

Adds CSV import/export to TeamSpirit's workload dialog and sorting & batch-select to the job assignment page.

## 詳細な説明

### 日本語

TSpirit Forge は、TeamSpirit の日常操作を補助するための非公式ブラウザ拡張です。

■ 工数実績ダイアログ
・CSV エクスポート — 現在の工数入力内容を workload.csv として保存
・CSV インポート — CSV ファイルから工数入力内容を一括反映
・日次確定済み画面でもエクスポート可能
※ CSV は name,time 形式です。

■ ジョブアサイン画面
・「ソート」ボタン — 設定したルールに基づいてジョブを並び替え
・「終了を全選択」ボタン — 終了済みジョブをまとめてチェック
・オプション画面からソートルールを自由に編集可能

■ ソートルール
・基本ソート: 並び替えなし / キー指定ソート
・条件ルール: 対象・比較条件・値を指定して特定ジョブを先頭や末尾に移動
・条件一致行のソート: 並び替えなし / 基本ソートと同じ / カスタム
・条件ルールはドラッグ＆ドロップで優先度を変更可能
・条件は上から順に評価され、複数一致時は後の条件が優先されます

■ デフォルト設定
・基本ソート: ジョブコード昇順
・条件ルール: 末尾が「(終了)」のジョブを最下部に移動

■ 対応ページ
・工数実績ダイアログ (AtkWorkTimeView)
・ジョブアサイン画面 (AtkEmpJobView)

■ プライバシー
・利用権限: storage のみ
・ソート設定はブラウザのローカルストレージに保存されます
・外部サーバーへのデータ送信はありません

■ ご注意
・この拡張は非公式です。TeamSpirit 社とは一切関係ありません。
・TeamSpirit の画面構成が変更された場合、動作しなくなる可能性があります。

### English

TSpirit Forge is an unofficial browser extension that enhances everyday TeamSpirit workflows.

■ Workload Dialog
• CSV Export — Save the current workload entries as workload.csv
• CSV Import — Load workload entries from a CSV file in one step
• Export is also available on the daily-confirmed view
  CSV format: name,time

■ Job Assignment Page
• "Sort" button — Reorder jobs based on your custom rules
• "Select All Expired" button — Check all expired jobs at once
• Fully customizable sort rules via the options page

■ Sort Rules
• Base sort: None / Sort by a specific key
• Conditional rules: Move jobs matching a target, condition, and value to the top or bottom
• Sort within matched rows: None / Same as base sort / Custom
• Drag-and-drop reordering of conditional rules
• Rules are evaluated top to bottom; when multiple rules match, the later rule takes priority

■ Default Settings
• Base sort: Job Code ascending
• Conditional rule: Move jobs ending with "(End)" to the bottom

■ Supported Pages
• Workload dialog (AtkWorkTimeView)
• Job assignment page (AtkEmpJobView)

■ Privacy
• Permission required: storage only
• Sort settings are saved in your browser's local storage
• No data is sent to any external server

■ Disclaimer
• This extension is unofficial and is not affiliated with TeamSpirit Inc.
• If TeamSpirit changes its page structure, the extension may stop working.
