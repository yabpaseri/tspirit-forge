import { i18n } from '#i18n';
import type { SortKey, SortOption, SortOrder } from '@/utils/sort-rule';
import { keyLabels, orderLabels } from '../labels';
import { Select } from './Select';

export function BaseSortEditor({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const isKeep = value.type === 'KEEP';

  return (
    <fieldset className="card">
      <legend>{i18n.t('baseSortLegend')}</legend>
      <p className="hint">{i18n.t('baseSortHint')}</p>
      <div className="row">
        <label className="radio-label">
          <input type="radio" checked={isKeep} onChange={() => onChange({ type: 'KEEP' })} />
          {i18n.t('sortOptionKeep')}
        </label>
        <label className="radio-label">
          <input
            type="radio"
            checked={!isKeep}
            onChange={() => onChange({ type: 'CUSTOMIZE', key: 'JOB_CODE', order: 'ASC' })}
          />
          {i18n.t('sortOptionSort')}
        </label>
      </div>
      {!isKeep && value.type === 'CUSTOMIZE' && (
        <div className="row indent">
          <Select
            label={i18n.t('labelKey')}
            value={value.key}
            options={keyLabels()}
            onChange={(key) => onChange({ ...value, key: key as SortKey })}
          />
          <Select
            label={i18n.t('labelOrder')}
            value={value.order}
            options={orderLabels()}
            onChange={(order) => onChange({ ...value, order: order as SortOrder })}
          />
        </div>
      )}
    </fieldset>
  );
}
