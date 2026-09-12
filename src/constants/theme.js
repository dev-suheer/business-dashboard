/* Hex values duplicated from the CSS theme tokens because Chart.js draws to canvas and
   cannot read Tailwind classes. Keep in sync with src/styles/index.css. */
export const COLORS = {
  ink: '#0A0F0D',
  emerald: '#10B981',
  emeraldSoft: '#34D399',
  mut: '#8A9A90',
  warn: '#F5A524',
  bad: '#F26D6D',
}

export const GRID = 'rgba(44,61,52,0.5)'

export const AGEING_LABELS = ['Current', '1–30d', '31–60d', '61–90d', '90d+']
export const AGEING_COLORS = ['#10B981', '#2DBB8A', '#F5A524', '#EF8B4B', '#F26D6D']

export const PAYMENT_LABELS = ['Paid', 'Scheduled', 'Pending', 'Overdue']
export const PAYMENT_COLORS = ['#10B981', '#2DBB8A', '#F5A524', '#F26D6D']
