import { ui } from '@/utils/dom';
import Papa from 'papaparse';
import * as v from 'valibot';
import { SEL } from './selectors';
import { TimeController } from './time-controller';

const CsvRow = v.object({ name: v.string(), time: v.string() });
type CsvRow = v.InferOutput<typeof CsvRow>;

export function handleExport(root: HTMLElement) {
  const rows = root.querySelectorAll<HTMLTableRowElement>(SEL.workRows);
  const data = [...rows].map(rowToData);
  const csv = Papa.unparse(data, { header: true, quotes: true });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = ui('a').done();
  a.href = url;
  a.download = 'workload.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export async function handleImport(root: HTMLElement) {
  const file = await pickFile('.csv');
  if (!file) return;
  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  const result = v.safeParse(v.array(CsvRow), parsed.data);
  if (!result.success) return;
  applyImport(root, result.output);
}

function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.item(0) ?? null);
    input.click();
  });
}

function rowToData(row: HTMLTableRowElement): CsvRow {
  const name = row.querySelector(SEL.jobName)?.textContent ?? '';
  const timeInput = row.querySelector<HTMLInputElement>(SEL.timeInput);
  const timeLabel = row.querySelector<HTMLDivElement>(SEL.timeLabel);
  if (timeInput?.checkVisibility?.()) return { name, time: timeInput.value };
  if (timeLabel?.checkVisibility?.()) {
    const val = timeLabel.textContent ?? '0:00';
    return { name, time: val === '-' ? '0:00' : val };
  }
  return { name, time: timeInput?.value ?? '0:00' };
}

function applyImport(root: HTMLElement, data: CsvRow[]) {
  const controllers = new Map<string, TimeController>();
  for (const row of root.querySelectorAll<HTMLTableRowElement>(SEL.workRows)) {
    const name = row.querySelector(SEL.jobName)?.textContent;
    if (!name) continue;
    const cell = row.querySelector<HTMLTableCellElement>('td:nth-of-type(2)');
    if (!cell) continue;
    const ctrl = TimeController.from(cell);
    if (!ctrl) continue;
    ctrl.reset();
    controllers.set(name, ctrl);
  }
  for (const d of data) {
    const ctrl = controllers.get(d.name);
    if (!ctrl) continue;
    if (d.time === '-') {
      ctrl.setAsVolume();
    } else {
      ctrl.setTime(d.time);
    }
  }
}
