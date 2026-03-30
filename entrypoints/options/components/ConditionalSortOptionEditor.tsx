import { i18n } from '#i18n';
import type { ConditionalSortOption, SortKey, SortOrder } from '@/utils/sort-rule';
import { keyLabels, orderLabels } from '../labels';
import { Select } from './Select';

export function ConditionalSortOptionEditor({
  value,
  onChange,
}: {
  value: ConditionalSortOption;
  onChange: (v: ConditionalSortOption) => void;
}) {
  return (
    <div className="sort-option-group">
      <div className="row">
        <label className="radio-label">
          <input
            type="radio"
            checked={value.type === 'KEEP'}
            onChange={() => onChange({ type: 'KEEP' })}
          />
          {i18n.t('sortOptionKeep')}
        </label>
        <label className="radio-label">
          <input
            type="radio"
            checked={value.type === 'BASE'}
            onChange={() => onChange({ type: 'BASE' })}
          />
          {i18n.t('sortOptionBase')}
        </label>
        <label className="radio-label">
          <input
            type="radio"
            checked={value.type === 'CUSTOMIZE'}
            onChange={() => onChange({ type: 'CUSTOMIZE', key: 'JOB_CODE', order: 'ASC' })}
          />
          {i18n.t('sortOptionCustomize')}
        </label>
      </div>
      {value.type === 'CUSTOMIZE' && (
        <div className="row">
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
    </div>
  );
}
