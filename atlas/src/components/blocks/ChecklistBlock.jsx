function normalizeCheckedByItemId(rawCheckedByItemId) {
  if (!rawCheckedByItemId || typeof rawCheckedByItemId !== 'object' || Array.isArray(rawCheckedByItemId)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(rawCheckedByItemId).filter(
      ([itemId, isChecked]) => typeof itemId === 'string' && typeof isChecked === 'boolean',
    ),
  )
}

function buildItemList(data) {
  if (!Array.isArray(data?.items)) {
    return []
  }
  return data.items.filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      !Array.isArray(item) &&
      typeof item.id === 'string' &&
      item.id.length > 0 &&
      typeof item.text === 'string',
  )
}

export function ChecklistBlockRender({ data, userState }) {
  const items = buildItemList(data)
  const checkedByItemId = normalizeCheckedByItemId(userState?.checkedByItemId)

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">Checklist is empty.</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2 text-sm text-slate-200">
          <input type="checkbox" checked={Boolean(checkedByItemId[item.id])} disabled readOnly />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

export function ChecklistBlockEditor({ data, userState, onUserStateChange }) {
  const items = buildItemList(data)
  const checkedByItemId = normalizeCheckedByItemId(userState?.checkedByItemId)

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">Checklist is empty.</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={Boolean(checkedByItemId[item.id])}
            onChange={(event) => {
              onUserStateChange?.({
                checkedByItemId: {
                  ...checkedByItemId,
                  [item.id]: event.target.checked,
                },
              })
            }}
          />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

