import { i18n } from '#i18n';
import type { ConditionalSort, WhenCondition, WhenTarget } from '@/utils/sort-rule';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { conditionLabels, moveLabels, targetLabels } from '../labels';
import { ConditionalSortOptionEditor } from './ConditionalSortOptionEditor';
import { Select } from './Select';

export function ConditionalSortEditor({
  id,
  index,
  value,
  onChange,
  onRemove,
}: {
  id: string;
  index: number;
  value: ConditionalSort;
  onChange: (v: ConditionalSort) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div className="cond-rule" ref={setNodeRef} style={style}>
      <div className="cond-rule-header">
        <div className="cond-rule-header-left">
          <span
            className="drag-handle"
            ref={setActivatorNodeRef}
            title={i18n.t('titleDrag')}
            {...attributes}
            {...listeners}
          >
            ⠿
          </span>
          <span className="cond-rule-num">#{index + 1}</span>
        </div>
        <div className="cond-rule-actions">
          <button
            type="button"
            className="btn-icon btn-delete"
            onClick={() => {
              if (confirm(i18n.t('confirmDelete'))) onRemove();
            }}
            title={i18n.t('titleDelete')}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="cond-rule-body">
        <label className="form-label">{i18n.t('labelCondition')}</label>
        <div className="cond-grid">
          <Select
            label={i18n.t('labelTarget')}
            value={value.when.target}
            options={targetLabels()}
            onChange={(target) =>
              onChange({ ...value, when: { ...value.when, target: target as WhenTarget } })
            }
          />
          <Select
            label={i18n.t('labelMatch')}
            value={value.when.condition}
            options={conditionLabels()}
            onChange={(condition) =>
              onChange({
                ...value,
                when: { ...value.when, condition: condition as WhenCondition },
              })
            }
          />
          <label className="select-label cond-value">
            <span className="select-label-text">{i18n.t('labelValue')}</span>
            <input
              type="text"
              className="text-input"
              placeholder={i18n.t('placeholderValue')}
              value={value.when.value}
              onChange={(e) =>
                onChange({ ...value, when: { ...value.when, value: e.target.value } })
              }
            />
          </label>
        </div>

        <label className="form-label">{i18n.t('labelMoveTo')}</label>
        <div>
          <Select
            value={value.moveto}
            options={moveLabels()}
            onChange={(moveto) => onChange({ ...value, moveto: moveto as 'TOP' | 'BOTTOM' })}
          />
        </div>

        <label className="form-label">{i18n.t('labelSort')}</label>
        <ConditionalSortOptionEditor
          value={value.sort}
          onChange={(sort) => onChange({ ...value, sort })}
        />
      </div>
    </div>
  );
}
