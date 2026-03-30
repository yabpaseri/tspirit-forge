import { i18n } from '#i18n';
import { ui } from '@/utils/dom';
import { Vault } from '@/utils/vault';
import { handleExport, handleImport } from './csv';
import { EXPIRED_SUFFIXES, FOOTER_RIGHT_ID, SEL } from './selectors';
import { applySortRule, parseRows } from './sort';

export default defineContentScript({
  matches: [
    'https://*.vf.force.com/apex/AtkWorkTimeView*', // 勤務表タブ
    'https://*.vf.force.com/apex/AtkEmpJobView*', // 工数実績タブ
  ],
  allFrames: true,
  main() {
    const observed = { workDialog: false, jobAssign: false };

    function check(node: HTMLElement) {
      if (!observed.workDialog && node.id === 'empWorkDialog') {
        observed.workDialog = true;
        setupWorkDialog(node);
      } else if (!observed.jobAssign && node.id === 'empJobAssign') {
        observed.jobAssign = true;
        setupJobAssign(node);
      }
    }

    const existingWork = document.querySelector<HTMLElement>('#empWorkDialog');
    if (existingWork) check(existingWork);
    const existingJob = document.querySelector<HTMLElement>('#empJobAssign');
    if (existingJob) check(existingJob);

    if (observed.workDialog && observed.jobAssign) return;

    const observer = new MutationObserver((mutations) => {
      for (const node of mutations.flatMap((m) => [...m.addedNodes])) {
        if (!(node instanceof HTMLElement)) continue;
        check(node);
        if (observed.workDialog && observed.jobAssign) {
          observer.disconnect();
          break;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
});

// ============================================================
// 工数実績ダイアログ
// ============================================================

function setupWorkDialog(root: HTMLElement) {
  const empWorkOption1 = root.querySelector<HTMLElement>('#empWorkOption1');
  if (!empWorkOption1) return;
  const footerParent = empWorkOption1.parentElement;
  if (!footerParent) return;

  const footer = ui('div')
    .id(FOOTER_RIGHT_ID)
    .style((css) => (css.display = 'inline-flex'))
    .append(...footerParent.childNodes)
    .appendTo(footerParent)
    .done();

  ui('button')
    .classes('std-button2')
    .style((css) => (css.marginLeft = 'auto'))
    .append(ui('div').text(i18n.t('btnImport')).done())
    .prependTo(footer)
    .done()
    .addEventListener('click', () => handleImport(root));

  ui('button')
    .classes('std-button2')
    .style((css) => (css.marginLeft = 'auto'))
    .append(ui('div').text(i18n.t('btnExport')).done())
    .prependTo(footer)
    .done()
    .addEventListener('click', () => handleExport(root));

  // 日次確定済みでも使えるエクスポートボタン（Row 2）
  const empWorkOption2 = root.querySelector<HTMLElement>('#empWorkOption2');
  if (empWorkOption2) {
    const opt2Parent = empWorkOption2.parentElement;
    if (opt2Parent) {
      const wrapper = ui('div')
        .style((css) => (css.display = 'inline-flex'))
        .append(...opt2Parent.childNodes)
        .appendTo(opt2Parent)
        .done();

      ui('button')
        .classes('std-button2')
        .style((css) => (css.marginLeft = 'auto'))
        .append(ui('div').text(i18n.t('btnExport')).done())
        .prependTo(wrapper)
        .done()
        .addEventListener('click', () => handleExport(root));
    }
  }
}

// ============================================================
// ジョブアサイン
// ============================================================

function setupJobAssign(root: HTMLElement) {
  const empJobUp = root.querySelector<HTMLButtonElement>('#empJobUp');
  if (!empJobUp) return;
  const sortParent = empJobUp.parentElement?.parentElement;
  if (!sortParent) return;

  ui('button')
    .classes('std-button2')
    .style((css) => (css.margin = '4px'))
    .append(ui('div').text(i18n.t('btnSort')).done())
    .appendTo(ui('td').appendTo(sortParent).done())
    .done()
    .addEventListener('click', () => handleSort(root, empJobUp));

  const empJobDel = root.querySelector('#empJobDel');
  const selectParent = empJobDel?.parentElement?.parentElement;
  if (!selectParent) return;

  ui('button')
    .classes('std-button2')
    .style((css) => (css.margin = '4px'))
    .append(ui('div').text(i18n.t('btnSelectExpired')).done())
    .appendTo(ui('td').appendTo(selectParent).done())
    .done()
    .addEventListener('click', () => handleSelectExpired(root));
}

async function handleSort(root: HTMLElement, empJobUp: HTMLButtonElement) {
  const tbody = root.querySelector<HTMLTableSectionElement>(SEL.jobTableBody);
  if (!tbody) return;
  const rows = tbody.querySelectorAll<HTMLTableRowElement>(':scope > tr');
  if (rows.length === 0) return;

  const infos = parseRows(rows);
  if (infos.length === 0) return;

  const rule = await Vault.sortRule.getValue();
  const sorted = applySortRule(infos, rule);

  const checked = tbody.querySelectorAll<HTMLInputElement>(
    ':scope > tr > td > input[type="checkbox"]:checked',
  );
  for (const c of checked) c.checked = false;
  for (const r of sorted) tbody.append(r.ele);
  empJobUp.click();
  for (const c of checked) c.checked = true;
}

function handleSelectExpired(root: HTMLElement) {
  for (const row of root.querySelectorAll(`${SEL.jobTableBody} > tr`)) {
    const checkbox = row.querySelector<HTMLInputElement>('input[type="checkbox"]');
    if (!checkbox) continue;
    const hasExpired = [...row.querySelectorAll('div > div')].some((div) =>
      EXPIRED_SUFFIXES.some((suffix) => div.textContent === suffix),
    );
    checkbox.checked = hasExpired;
  }
}
