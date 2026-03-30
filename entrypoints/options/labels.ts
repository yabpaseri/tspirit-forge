import { i18n } from '#i18n';
import type { SortKey, SortOrder, WhenCondition, WhenTarget } from '@/utils/sort-rule';

export const keyLabels = (): Record<SortKey, string> => ({
  JOB_CODE: i18n.t('keyJobCode'),
  JOB_NAME: i18n.t('keyJobName'),
});

export const orderLabels = (): Record<SortOrder, string> => ({
  ASC: i18n.t('orderAsc'),
  DESC: i18n.t('orderDesc'),
});

export const moveLabels = (): Record<'TOP' | 'BOTTOM', string> => ({
  TOP: i18n.t('moveTop'),
  BOTTOM: i18n.t('moveBottom'),
});

export const targetLabels = (): Record<WhenTarget, string> => ({
  JOB_CODE: i18n.t('keyJobCode'),
  JOB_NAME: i18n.t('keyJobName'),
});

export const conditionLabels = (): Record<WhenCondition, string> => ({
  MATCH: i18n.t('condMatch'),
  NOT_MATCH: i18n.t('condNotMatch'),
  INCLUDE: i18n.t('condInclude'),
  NOT_INCLUDE: i18n.t('condNotInclude'),
  STARTS_WITH: i18n.t('condStartsWith'),
  ENDS_WITH: i18n.t('condEndsWith'),
  NOT_STARTS_WITH: i18n.t('condNotStartsWith'),
  NOT_ENDS_WITH: i18n.t('condNotEndsWith'),
  MATCH_REGEXP: i18n.t('condMatchRegexp'),
  NOT_MATCH_REGEXP: i18n.t('condNotMatchRegexp'),
});
