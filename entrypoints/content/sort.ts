import type { ConditionalSortOption, SortOption, SortRule, When } from '@/utils/sort-rule';
import { SEL } from './selectors';

const compare = <T>(a: T, b: T): -1 | 0 | 1 => {
  if (a === b) return 0;
  return a > b ? 1 : -1;
};

export interface RowInfo {
  ele: HTMLTableRowElement;
  jobCode: string;
  jobName: string;
}

export function parseRows(rows: NodeListOf<HTMLTableRowElement>): RowInfo[] {
  const result: RowInfo[] = [];
  for (const row of rows) {
    const jobCode = row.querySelector(SEL.jobCode)?.textContent;
    const jobName = row.querySelector(SEL.jobNameCell)?.textContent;
    if (!jobCode || !jobName) continue;
    result.push({ ele: row, jobCode, jobName });
  }
  return result;
}

export function applySortRule(infos: RowInfo[], rule: SortRule): RowInfo[] {
  if (rule.conditional.length === 0) {
    applySort(rule.base, infos);
    return infos;
  }

  const tops: RowInfo[] = [];
  const bottoms: RowInfo[] = [];

  for (const cr of rule.conditional) {
    const matched = infos.filter((r) => isMatchWhen(cr.when, r));
    applyConditionalSort(cr.sort, rule.base, matched);

    // 後勝ち: 以前の条件で配置済みでも取り除いて再配置する
    const set = new Set(matched);
    removeAll(tops, set);
    removeAll(bottoms, set);

    if (cr.moveto === 'TOP') {
      tops.unshift(...matched);
    } else {
      bottoms.push(...matched);
    }
  }

  const placed = new Set([...tops, ...bottoms]);
  const middle = infos.filter((r) => !placed.has(r));
  applySort(rule.base, middle);
  return [...tops, ...middle, ...bottoms];
}

function removeAll(arr: RowInfo[], set: Set<RowInfo>) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (set.has(arr[i])) arr.splice(i, 1);
  }
}

function applySort(option: SortOption, rows: RowInfo[]) {
  if (option.type === 'KEEP') return;
  const order = option.order === 'ASC' ? 1 : -1;
  rows.sort((a, b) => {
    const [ak, bk] = option.key === 'JOB_CODE' ? [a.jobCode, b.jobCode] : [a.jobName, b.jobName];
    if (option.regexp) {
      const re = safeRegExp(option.regexp.pattern);
      if (re) {
        re.lastIndex = 0;
        const am = [...ak.matchAll(new RegExp(re.source, 'g'))]
          .at(option.regexp.matchIndex)
          ?.at(option.regexp.captureIndex);
        const bm = [...bk.matchAll(new RegExp(re.source, 'g'))]
          .at(option.regexp.matchIndex)
          ?.at(option.regexp.captureIndex);
        if (am != null && bm != null) return compare(am, bm) * order;
      }
    }
    return compare(ak, bk) * order;
  });
}

function applyConditionalSort(option: ConditionalSortOption, base: SortOption, rows: RowInfo[]) {
  if (option.type === 'KEEP') return;
  if (option.type === 'BASE') return applySort(base, rows);
  applySort(option, rows);
}

function isMatchWhen(when: When, row: RowInfo): boolean {
  const target = when.target === 'JOB_CODE' ? row.jobCode : row.jobName;
  const val = when.value;
  switch (when.condition) {
    case 'MATCH':
      return target === val;
    case 'NOT_MATCH':
      return target !== val;
    case 'INCLUDE':
      return target.includes(val);
    case 'NOT_INCLUDE':
      return !target.includes(val);
    case 'STARTS_WITH':
      return target.startsWith(val);
    case 'ENDS_WITH':
      return target.endsWith(val);
    case 'NOT_STARTS_WITH':
      return !target.startsWith(val);
    case 'NOT_ENDS_WITH':
      return !target.endsWith(val);
    case 'MATCH_REGEXP':
      return safeRegExp(val)?.test(target) ?? false;
    case 'NOT_MATCH_REGEXP':
      return !(safeRegExp(val)?.test(target) ?? true);
  }
}

function safeRegExp(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern);
  } catch {
    return null;
  }
}
