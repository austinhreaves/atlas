import { useMemo, useState } from 'react'
import KatexText from '../components/KatexText.jsx'

const OPTIONAL_FIELDS = [
  { key: 'formula', label: 'Formula' },
  { key: 'description', label: 'Description' },
  { key: 'simplifying_assumption', label: 'Simplifying assumption' },
  { key: 'applicability', label: 'Applicability' },
  { key: 'misconception', label: 'Misconception' },
]

function normalizeOptionalValue(value) {
  return typeof value === 'string' ? value : ''
}

function deriveInitialFieldOrder(studentNode) {
  if (Array.isArray(studentNode?.field_order)) {
    const seen = new Set()
    const ordered = studentNode.field_order.filter((field) => {
      if (!OPTIONAL_FIELDS.some((entry) => entry.key === field) || seen.has(field)) {
        return false
      }
      seen.add(field)
      return true
    })
    for (const entry of OPTIONAL_FIELDS) {
      const contentValue = studentNode?.content?.[entry.key]
      if (typeof contentValue === 'string' && contentValue.trim().length > 0 && !seen.has(entry.key)) {
        ordered.push(entry.key)
      }
    }
    return ordered
  }

  return OPTIONAL_FIELDS
    .filter((entry) => typeof studentNode?.content?.[entry.key] === 'string' && studentNode.content[entry.key].trim().length > 0)
    .map((entry) => entry.key)
}

function toNullable(value) {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? value : null
}

/** @param {{ mode: 'create' | 'edit', node: any, onClose: () => void, onCreate?: (payload: any) => void, onSave?: (payload: any) => void }} props */
export default function StudentNodePanel({ mode, node, onClose, onCreate, onSave }) {
  const [title, setTitle] = useState(typeof node?.title === 'string' ? node.title : '')
  const [notes, setNotes] = useState(typeof node?.content?.notes === 'string' ? node.content.notes : '')
  const [color, setColor] = useState(typeof node?.color === 'string' ? node.color : '')
  const [fieldOrder, setFieldOrder] = useState(() => deriveInitialFieldOrder(node))
  const [optionalValues, setOptionalValues] = useState(() => ({
    formula: normalizeOptionalValue(node?.content?.formula),
    description: normalizeOptionalValue(node?.content?.description),
    simplifying_assumption: normalizeOptionalValue(node?.content?.simplifying_assumption),
    applicability: normalizeOptionalValue(node?.content?.applicability),
    misconception: normalizeOptionalValue(node?.content?.misconception),
  }))

  const remainingFields = useMemo(
    () => OPTIONAL_FIELDS.filter((field) => !fieldOrder.includes(field.key)),
    [fieldOrder],
  )

  function buildPayload() {
    return {
      title: title.trim(),
      color: toNullable(color),
      field_order: [...fieldOrder],
      content: {
        notes,
        formula: fieldOrder.includes('formula') ? toNullable(optionalValues.formula) : null,
        description: fieldOrder.includes('description') ? toNullable(optionalValues.description) : null,
        simplifying_assumption: fieldOrder.includes('simplifying_assumption')
          ? toNullable(optionalValues.simplifying_assumption)
          : null,
        applicability: fieldOrder.includes('applicability') ? toNullable(optionalValues.applicability) : null,
        misconception: fieldOrder.includes('misconception') ? toNullable(optionalValues.misconception) : null,
      },
    }
  }

  function emitSave() {
    if (mode !== 'edit' || typeof onSave !== 'function') {
      return
    }
    onSave(buildPayload())
  }

  function handleAddField(fieldKey) {
    if (fieldOrder.includes(fieldKey)) {
      return
    }
    const nextOrder = [...fieldOrder, fieldKey]
    setFieldOrder(nextOrder)
    if (mode === 'edit' && typeof onSave === 'function') {
      onSave({
        ...buildPayload(),
        field_order: nextOrder,
      })
    }
  }

  function handleRemoveField(fieldKey) {
    const nextOrder = fieldOrder.filter((key) => key !== fieldKey)
    setFieldOrder(nextOrder)
    if (mode === 'edit' && typeof onSave === 'function') {
      onSave({
        ...buildPayload(),
        field_order: nextOrder,
      })
    }
  }

  function moveField(fieldKey, direction) {
    const index = fieldOrder.indexOf(fieldKey)
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (index < 0 || nextIndex < 0 || nextIndex >= fieldOrder.length) {
      return
    }
    const nextOrder = [...fieldOrder]
    const [item] = nextOrder.splice(index, 1)
    nextOrder.splice(nextIndex, 0, item)
    setFieldOrder(nextOrder)
    if (mode === 'edit' && typeof onSave === 'function') {
      onSave({
        ...buildPayload(),
        field_order: nextOrder,
      })
    }
  }

  function handleCreate() {
    const nextTitle = title.trim()
    if (nextTitle.length === 0 || typeof onCreate !== 'function') {
      return
    }
    onCreate(buildPayload())
  }

  return (
    <aside className="absolute right-4 top-4 z-50 w-[360px] rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          {mode === 'create' ? 'Create student node' : 'Edit student node'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
        >
          Close
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <label className="block text-xs font-medium text-slate-300" htmlFor="student-node-title">
          Title
        </label>
        <input
          id="student-node-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={emitSave}
          className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
          placeholder="Required"
        />

        <label className="block text-xs font-medium text-slate-300" htmlFor="student-node-color">
          Domain color (optional)
        </label>
        <input
          id="student-node-color"
          type="text"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          onBlur={emitSave}
          className="w-full rounded border border-slate-600 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
          placeholder="#38bdf8"
        />

        <label className="block text-xs font-medium text-slate-300" htmlFor="student-node-notes">
          Notes
        </label>
        <textarea
          id="student-node-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          onBlur={emitSave}
          className="min-h-[96px] w-full rounded border border-slate-600 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
          placeholder="Markdown + KaTeX notes"
        />
        <div className="rounded border border-slate-700 bg-slate-950/70 p-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Preview</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{notes || 'No notes yet.'}</p>
          {fieldOrder.includes('formula') && optionalValues.formula.trim().length > 0 ? (
            <div className="mt-2 border-t border-slate-700 pt-2">
              <KatexText math={optionalValues.formula} className="text-sm text-cyan-100" />
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          {fieldOrder.map((fieldKey, index) => {
            const field = OPTIONAL_FIELDS.find((entry) => entry.key === fieldKey)
            if (!field) {
              return null
            }
            return (
              <div key={field.key} className="rounded border border-slate-700 bg-slate-950/60 p-2">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{field.label}</p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveField(field.key, 'up')}
                      className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-200 hover:bg-slate-700"
                      disabled={index === 0}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveField(field.key, 'down')}
                      className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-200 hover:bg-slate-700"
                      disabled={index === fieldOrder.length - 1}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.key)}
                      className="rounded border border-rose-500/60 bg-rose-900/25 px-1.5 py-0.5 text-[11px] text-rose-200 hover:bg-rose-800/40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <textarea
                  value={optionalValues[field.key]}
                  onChange={(event) => {
                    const nextValue = event.target.value
                    setOptionalValues((current) => ({ ...current, [field.key]: nextValue }))
                  }}
                  onBlur={emitSave}
                  aria-label={field.label}
                  className="min-h-[64px] w-full rounded border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                />
              </div>
            )
          })}
        </div>

        {remainingFields.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {remainingFields.map((field) => (
              <button
                key={field.key}
                type="button"
                onClick={() => handleAddField(field.key)}
                className="rounded border border-cyan-500/70 bg-cyan-800/20 px-2 py-1 text-xs font-semibold text-cyan-100 hover:bg-cyan-700/30"
              >
                + Add {field.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {mode === 'create' ? (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded border border-cyan-500/70 bg-cyan-700/30 px-3 py-1.5 text-sm font-semibold text-cyan-100 hover:bg-cyan-700/50"
            disabled={title.trim().length === 0}
          >
            Create
          </button>
        </div>
      ) : null}
    </aside>
  )
}
