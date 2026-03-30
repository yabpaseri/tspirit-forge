import type { SortRule } from '@/utils/sort-rule';
import { Vault } from '@/utils/vault';
import { useCallback, useRef, useState } from 'react';

const SAVE_INDICATOR_MS = 2000;

export function useSave() {
  const [saved, setSaved] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const flash = useCallback(() => {
    setSaved(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(false), SAVE_INDICATOR_MS);
  }, []);

  const save = useCallback(
    (rule: SortRule) => {
      Vault.sortRule.setValue(rule);
      flash();
    },
    [flash],
  );

  return { saved, save };
}
