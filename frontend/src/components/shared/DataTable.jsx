import { useState } from 'react'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'

/**
 * Admin data table with search and pagination.
 *
 * @param {Object} props
 * @param {Array<{ key: string, label?: string, header?: string, render?: (cell: unknown, row: object) => React.ReactNode }>} props.columns - use `label` or `header` for column title
 * @param {Array<object>} props.data
 * @param {boolean} [props.isLoading] - when true, shows skeleton instead of rows
 * @param {(row: object) => void} [props.onEdit] - receives full row
 * @param {(id: string) => void} [props.onDelete] - receives row **id** (uuid string), not the row object
 * @param {(id: string, isVisible: boolean) => void} [props.onToggleVisibility]
 */
const DataTable = ({ columns, data = [], isLoading = false, onEdit, onDelete, onToggleVisibility }) => {
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)
  const PER_PAGE = 10

  const colTitle = (col) => col.label ?? col.header ?? col.key

  const filtered   = data.filter((row) =>
    columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const colSpan = columns.length + 2

  return (
    <div className="data-table-wrapper">
      <div className="table-toolbar">
        <input
          className="table-search"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <span className="table-count">{isLoading ? '…' : `${filtered.length} record(s)`}</span>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => <th key={col.key}>{colTitle(col)}</th>)}
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={colSpan} style={{ padding: 'var(--space-6)', border: 'none' }}>
                  <LoadingSkeleton count={5} />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={colSpan} className="table-empty">No records found.</td></tr>
            ) : paginated.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key} title={String(row[col.key] ?? '')}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
                <td>
                  {onToggleVisibility ? (
                    <button
                      type="button"
                      className={`visibility-btn ${row.is_visible ? 'visible' : 'hidden'}`}
                      onClick={() => onToggleVisibility(row.id, row.is_visible)}
                    >
                      {row.is_visible ? '👁 Visible' : '🚫 Hidden'}
                    </button>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                      {row.is_visible ? '✅' : '🚫'}
                    </span>
                  )}
                </td>
                <td>
                  <div className="action-btns">
                    <button type="button" className="btn-icon btn-edit"   onClick={() => onEdit?.(row)}    title="Edit">✏️</button>
                    <button type="button" className="btn-icon btn-delete" onClick={() => onDelete?.(row.id)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="pagination">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}           disabled={page === 1}>← Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}  disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  )
}

export default DataTable
