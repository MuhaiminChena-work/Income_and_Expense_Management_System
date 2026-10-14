export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_SHORT_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export function formatCurrency(amount: number, currency: string = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ฿';
}

export function formatMonthYear(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const thaiYear = parseInt(year, 10) + 543;
  return `${THAI_MONTHS[monthIndex]} ${year} (${thaiYear})`;
}

export function formatShortMonthYear(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return `${THAI_SHORT_MONTHS[monthIndex]} ${year}`;
}

export function formatThaiDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} ${THAI_SHORT_MONTHS[monthIndex]} ${year}`;
}
