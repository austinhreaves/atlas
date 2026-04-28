export default function TableBlock({ data }) {
  const columns = Array.isArray(data?.columns) ? data.columns : []
  const rows = Array.isArray(data?.rows) ? data.rows : []
  const caption = typeof data?.caption === 'string' ? data.caption : ''

  if (columns.length === 0) {
    return <p className="text-sm text-slate-400">Table columns are missing.</p>
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-slate-700/80">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-800/90 text-xs uppercase tracking-wider text-slate-300">
            <tr>
              {columns.map((column, index) => (
                <th key={`${column}-${index}`} className="px-3 py-2 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-t border-slate-700/70">
                {columns.map((_, columnIndex) => (
                  <td key={`cell-${rowIndex}-${columnIndex}`} className="px-3 py-2 align-top">
                    {Array.isArray(row) && typeof row[columnIndex] === 'string' ? row[columnIndex] : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <p className="text-xs text-slate-400">{caption}</p> : null}
    </div>
  )
}

