import { i18n } from '#i18n';
import type { ConditionalSort } from '@/utils/sort-rule';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useStableKeys } from '../hooks/use-stable-keys';
import { ConditionalSortEditor } from './ConditionalSortEditor';

const EMPTY_CONDITION: ConditionalSort = {
  when: { target: 'JOB_NAME', condition: 'ENDS_WITH', value: '' },
  sort: { type: 'KEEP' },
  moveto: 'BOTTOM',
};

export function ConditionalSortList({
  items,
  onChange,
}: {
  items: ConditionalSort[];
  onChange: (v: ConditionalSort[]) => void;
}) {
  const keyed = useStableKeys(items);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const add = () => onChange([...items, EMPTY_CONDITION]);

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const updateItem = (i: number, next: ConditionalSort) =>
    onChange(items.map((item, idx) => (idx === i ? next : item)));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = keyed.findIndex((item) => item._key === active.id);
      const newIndex = keyed.findIndex((item) => item._key === over.id);
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <fieldset className="card">
      <legend>{i18n.t('condRuleLegend')}</legend>
      <p className="hint">{i18n.t('condRuleHint')}</p>

      {items.length === 0 && <p className="empty">{i18n.t('condRuleEmpty')}</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={keyed.map((k) => k._key)} strategy={verticalListSortingStrategy}>
          {keyed.map((item, i) => (
            <ConditionalSortEditor
              key={item._key}
              id={item._key}
              index={i}
              value={item}
              onChange={(next) => updateItem(i, next)}
              onRemove={() => remove(i)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button type="button" className="btn-add" onClick={add}>
        {i18n.t('btnAddRule')}
      </button>
    </fieldset>
  );
}
