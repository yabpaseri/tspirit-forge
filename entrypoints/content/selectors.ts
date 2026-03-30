/** TeamSpirit DOM セレクタ定数 */
export const SEL = {
  /** ジョブ名テキスト（工数実績行） */
  jobName: 'td:first-of-type > .name > .name:last-child',
  /** 工数入力フィールド */
  timeInput: 'input[id^="empInputTime"]',
  /** 工数ラベル（読み取り専用） */
  timeLabel: 'div[id^="empTimeLabel"]',
  /** 時計モードラベル */
  clockLabel: 'label[id^="btnClock2Label"]',
  /** パーセントモードラベル */
  percentLabel: 'label[id^="btnPercentLabel"]',
  /** 増減ボタン */
  increment: 'div:first-of-type tbody > tr.dijitReset:nth-of-type(2) > td:last-of-type > div',
  /** アクティブトグルクラス */
  toggleActive: 'toggle_switch_label_active',
  /** 工数テーブルの行 */
  workRows: '#empWorkTableBody > tr',
  /** ジョブアサインテーブル tbody */
  jobTableBody: '#empJobRightTable > tbody',
  /** ジョブコードセル */
  jobCode: ':scope > td:nth-of-type(2) > div',
  /** ジョブ名セル（ジョブアサイン行） */
  jobNameCell: ':scope > td:nth-of-type(3) > div',
} as const;

export const EXPIRED_SUFFIXES = ['(終了)', '(End)'];
export const FOOTER_RIGHT_ID = 'tsw__work_dialog_footer_right';
