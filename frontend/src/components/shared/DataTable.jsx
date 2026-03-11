import { useState } from 'react'

const DataTable = ({ columns, data = [], onEdit, onDelete, onToggleVisibility }) => {
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)
  const PER_PAGE = 10

  const filtered   = data.filter((row) =>
    columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="data-table-wrapper">
      <div className="table-toolbar">
        <input
          className="table-search"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <span className="table-count">{filtered.length} record(s)</span>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => <th key={col.key}>{col.label}</th>)}
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length + 2} className="table-empty">No records found.</td></tr>
            ) : paginated.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key} title={String(row[col.key] ?? '')}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
                <td>
                  <button
                    className={`visibility-btn ${row.is_visible ? 'visible' : 'hidden'}`}
                    onClick={() => onToggleVisibility?.(row.id, row.is_visible)}
                  >
                    {row.is_visible ? '👁 Visible' : '🚫 Hidden'}
                  </button>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon btn-edit"   onClick={() => onEdit?.(row)}    title="Edit">✏️</button>
                    <button className="btn-icon btn-delete" onClick={() => onDelete?.(row.id)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))}           disabled={page === 1}>← Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}  disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  )
}

export default DataTable
