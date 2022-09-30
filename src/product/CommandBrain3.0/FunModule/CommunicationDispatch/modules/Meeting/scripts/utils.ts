export function formatDuration(duration: number): string {
  if (duration) {
    const seconds = duration % 60;
    const minutes = Math.round(duration / 60) % 60;
    const hours = Math.round(duration / 60 / 60);
    return `${hours}小时 ${minutes}分${seconds}秒`;
  }
  return '-';
}

export function isImg(url: string): boolean {
  return !!url.match(/\.(svg|png|jpe?g|webp|gif)$/i);
}

export function getNow(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / 1000);
}

export default {
  formatDuration,
  isImg,
  getNow,
};
