export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
}

export const formatYear = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear()
}

export const clsx = (...classes) => classes.filter(Boolean).join(' ')
