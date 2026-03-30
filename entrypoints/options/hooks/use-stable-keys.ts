import type { ConditionalSort } from '@/utils/sort-rule';
import { useMemo, useRef } from 'react';

export type KeyedItem = ConditionalSort & { _key: string };

export function useStableKeys(items: ConditionalSort[]): KeyedItem[] {
  const counter = useRef(0);
  const prevItems = useRef<ConditionalSort[]>([]);
  const prevKeys = useRef<string[]>([]);

  return useMemo(() => {
    const oldItems = prevItems.current;
    const oldKeys = prevKeys.current;
    const usedOld = new Set<number>();
    const keys: (string | undefined)[] = new Array(items.length);

    // Match reordered items by reference identity
    for (let i = 0; i < items.length; i++) {
      const oldIdx = oldItems.findIndex((o, j) => !usedOld.has(j) && o === items[i]);
      if (oldIdx !== -1) {
        keys[i] = oldKeys[oldIdx];
        usedOld.add(oldIdx);
      }
    }

    // Edited items: reuse key at same position; new items: generate
    for (let i = 0; i < items.length; i++) {
      if (!keys[i]) {
        if (i < oldKeys.length && !usedOld.has(i)) {
          keys[i] = oldKeys[i];
          usedOld.add(i);
        } else {
          keys[i] = `c${counter.current++}`;
        }
      }
    }

    prevItems.current = items;
    prevKeys.current = keys as string[];
    return items.map((item, i) => ({ ...item, _key: keys[i]! }));
  }, [items]);
}
