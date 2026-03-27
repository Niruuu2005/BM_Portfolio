export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
}

export const formatYear = (value) => {
  if (!value && value !== 0) return ''
  // If it's already a plain integer year (e.g. 2015), return it directly
  if (typeof value === 'number' && value > 1000) return value
  const parsed = parseInt(value, 10)
  if (!isNaN(parsed) && String(parsed) === String(value).trim()) return parsed
  return new Date(value).getFullYear()
}

export const clsx = (...classes) => classes.filter(Boolean).join(' ')
