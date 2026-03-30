import * as v from 'valibot';

// ---- 基本型 ----

export const SortKey = v.picklist(['JOB_CODE', 'JOB_NAME']);
export type SortKey = v.InferOutput<typeof SortKey>;

export const SortOrder = v.picklist(['ASC', 'DESC']);
export type SortOrder = v.InferOutput<typeof SortOrder>;

export const ConditionalMove = v.picklist(['TOP', 'BOTTOM']);
export type ConditionalMove = v.InferOutput<typeof ConditionalMove>;

export const WhenTarget = v.picklist(['JOB_CODE', 'JOB_NAME']);
export type WhenTarget = v.InferOutput<typeof WhenTarget>;

export const WhenCondition = v.picklist([
  'MATCH',
  'NOT_MATCH',
  'INCLUDE',
  'NOT_INCLUDE',
  'STARTS_WITH',
  'ENDS_WITH',
  'NOT_STARTS_WITH',
  'NOT_ENDS_WITH',
  'MATCH_REGEXP',
  'NOT_MATCH_REGEXP',
]);
export type WhenCondition = v.InferOutput<typeof WhenCondition>;

// ---- 正規表現ソート ----

export const SortRegexp = v.object({
  pattern: v.string(),
  matchIndex: v.number(),
  captureIndex: v.number(),
});
export type SortRegexp = v.InferOutput<typeof SortRegexp>;

// ---- ソートオプション ----

export const SortOptionKeep = v.object({ type: v.literal('KEEP') });
export const SortOptionCustomize = v.object({
  type: v.literal('CUSTOMIZE'),
  key: SortKey,
  order: SortOrder,
  regexp: v.optional(SortRegexp),
});

export const SortOption = v.variant('type', [SortOptionKeep, SortOptionCustomize]);
export type SortOption = v.InferOutput<typeof SortOption>;

// ---- 条件付きソートオプション（BASE追加） ----

export const ConditionalSortOption = v.variant('type', [
  SortOptionKeep,
  SortOptionCustomize,
  v.object({ type: v.literal('BASE') }),
]);
export type ConditionalSortOption = v.InferOutput<typeof ConditionalSortOption>;

// ---- When 条件 ----

export const When = v.object({
  target: WhenTarget,
  condition: WhenCondition,
  value: v.string(),
});
export type When = v.InferOutput<typeof When>;

// ---- 条件付きソート ----

export const ConditionalSort = v.object({
  when: When,
  sort: ConditionalSortOption,
  moveto: ConditionalMove,
});
export type ConditionalSort = v.InferOutput<typeof ConditionalSort>;

// ---- ソートルール ----

export const SortRule = v.object({
  version: v.literal(2),
  base: SortOption,
  conditional: v.array(ConditionalSort),
});
export type SortRule = v.InferOutput<typeof SortRule>;

const expiredSuffix = (locale: string) => (locale.startsWith('ja') ? '(終了)' : '(End)');

export const defaultSortRule = (locale = navigator.language): SortRule => ({
  version: 2,
  base: { type: 'CUSTOMIZE', key: 'JOB_CODE', order: 'ASC' },
  conditional: [
    {
      when: { target: 'JOB_NAME', condition: 'ENDS_WITH', value: expiredSuffix(locale) },
      sort: { type: 'KEEP' },
      moveto: 'BOTTOM',
    },
  ],
});
