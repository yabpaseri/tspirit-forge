import { SEL } from './selectors';

export class TimeController {
  private constructor(
    private readonly incrementButton: HTMLDivElement,
    private readonly timeInput: HTMLInputElement,
    private readonly clockLabel: HTMLLabelElement,
    private readonly percentLabel: HTMLLabelElement,
  ) {}

  static from(cell: HTMLTableCellElement): TimeController | null {
    const incrementButton = cell.querySelector<HTMLDivElement>(SEL.increment);
    const timeInput = cell.querySelector<HTMLInputElement>(SEL.timeInput);
    const clockLabel = cell.querySelector<HTMLLabelElement>(SEL.clockLabel);
    const percentLabel = cell.querySelector<HTMLLabelElement>(SEL.percentLabel);
    if (!(incrementButton && timeInput && clockLabel && percentLabel)) return null;
    return new TimeController(incrementButton, timeInput, clockLabel, percentLabel);
  }

  reset() {
    this.setTime('0:00');
  }

  setTime(time: string) {
    this.switchMode('time');
    this.timeInput.value = time;
    this.timeInput.dispatchEvent(new MouseEvent('blur'));
  }

  setAsVolume() {
    this.switchMode('volume');
    this.incrementButton.dispatchEvent(new MouseEvent('mousedown'));
    this.incrementButton.dispatchEvent(new MouseEvent('mouseup'));
  }

  private switchMode(mode: 'time' | 'volume') {
    if (mode === 'time' && !this.clockLabel.classList.contains(SEL.toggleActive)) {
      this.clockLabel.click();
    } else if (mode === 'volume' && !this.percentLabel.classList.contains(SEL.toggleActive)) {
      this.percentLabel.click();
    }
  }
}
