export const formattedDate = (_date: Date): string => `${
  _date.getFullYear()
}-${
  String(_date.getMonth() + 1).padStart(2, '0')
}-${
  String(_date.getDate()).padStart(2, '0')
}`;

const date = new Date();

const year = date.getFullYear();

const month = String(date.getMonth() + 1).padStart(2, '0');

const day = String(date.getDate()).padStart(2, '0');

const dateByquarter = [
  [`${year}-01-01`, `${year}-3-31`],
  [`${year}-04-01`, `${year}-6-30`],
  [`${year}-07-01`, `${year}-9-30`],
  [`${year}-10-01`, `${year}-12-31`],
];

export const thisDay = `${year}-${month}-${day}`;

export const thisQuarter = dateByquarter[Number(month) % 4];

const monthStart = `${
  date.getFullYear()
}-${
  String(date.getMonth() + 1).padStart(2, '0')
}-01`;

const monthEndDate = new Date(new Date(`${
  date.getFullYear()
}-${
  String(date.getMonth() + 2).padStart(2, '0')
}-01`).getTime() - 24 * 60 * 60 * 1000);

const monthEnd = formattedDate(monthEndDate);

export const thisMonth = [monthStart, monthEnd];

export const thisYear = [`${year}-01-01`, `${year}-12-31`];
