import { i18n } from '#i18n';
import type { SortRule } from '@/utils/sort-rule';
import { defaultSortRule } from '@/utils/sort-rule';
import { Vault } from '@/utils/vault';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { BaseSortEditor } from './components/BaseSortEditor';
import { ConditionalSortList } from './components/ConditionalSortList';
import { useSave } from './hooks/use-save';

export default function App() {
  const [rule, setRule] = useState<SortRule>(defaultSortRule);
  const { saved, save } = useSave();

  useEffect(() => {
    Vault.sortRule.getValue().then(setRule);
  }, []);

  const update = useCallback(
    (next: SortRule) => {
      setRule(next);
      save(next);
    },
    [save],
  );

  const handleReset = useCallback(() => {
    if (confirm(i18n.t('confirmReset'))) {
      update(defaultSortRule());
    }
  }, [update]);

  return (
    <>
      <header>
        <h1>{i18n.t('optionsTitle')}</h1>
      </header>
      <main>
        <section>
          <div className="section-header">
            <h2>{i18n.t('sortRuleHeading')}</h2>
            <button type="button" className="btn-link" onClick={handleReset}>
              {i18n.t('btnResetDefault')}
            </button>
          </div>
          <p className="description">{i18n.t('sortRuleDescription')}</p>

          <BaseSortEditor value={rule.base} onChange={(base) => update({ ...rule, base })} />

          <ConditionalSortList
            items={rule.conditional}
            onChange={(conditional) => update({ ...rule, conditional })}
          />

          {saved && <p className="saved">{i18n.t('savedIndicator')}</p>}
        </section>
      </main>
    </>
  );
}
