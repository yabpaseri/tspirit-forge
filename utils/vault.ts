import { type SortRule, defaultSortRule } from '@/utils/sort-rule';

export const Vault = {
  debug: storage.defineItem<boolean>('local:debug', {
    fallback: false,
    version: 1,
  }),
  sortRule: storage.defineItem<SortRule>('local:sortRule', {
    fallback: defaultSortRule(),
    init: defaultSortRule,
    version: 2,
  }),
} as const;
