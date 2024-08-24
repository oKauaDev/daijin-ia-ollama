export default function sendProgressBar(total: number, current: number, barLength: number = 20) {
  const progress = (current / total) * barLength;
  const filledBar = "█".repeat(progress);
  const emptyBar = " ".repeat(barLength - progress);
  const percentage = ((current / total) * 100).toFixed(2);

  if (total > 0 && !Number.isNaN((current / total) * 100)) {
    process.stdout.write(`\r[${filledBar}${emptyBar}] ${percentage}%`);
  }
}
