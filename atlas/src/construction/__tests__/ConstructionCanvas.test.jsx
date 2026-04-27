// @vitest-environment jsdom
import { act } from 'react'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConstructionCanvas from '../ConstructionCanvas.jsx'

const reactFlowHandlers = vi.hoisted(() => ({
  onNodesChange: null,
  onNodeDragStop: null,
  onNodeContextMenu: null,
  onNodeClick: null,
  onPaneDoubleClick: null,
  onPaneClick: null,
  onConnect: null,
  onEdgeClick: null,
  lastProps: null,
}))

const storeMocks = vi.hoisted(() => ({
  loadConstructionSession: vi.fn(),
  saveConstructionSession: vi.fn(),
}))

const dataMocks = vi.hoisted(() => ({
  getAllEntities: vi.fn(),
}))

vi.mock('reactflow', () => ({
  ReactFlow: ({
    children,
    onNodesChange,
    onNodeDragStop,
    onNodeContextMenu,
    onNodeClick,
    onPaneDoubleClick,
    onPaneClick,
    onConnect,
    onEdgeClick,
    ...props
  }) => {
    reactFlowHandlers.onNodesChange = onNodesChange
    reactFlowHandlers.onNodeDragStop = onNodeDragStop
    reactFlowHandlers.onNodeContextMenu = onNodeContextMenu
    reactFlowHandlers.onNodeClick = onNodeClick
    reactFlowHandlers.onPaneDoubleClick = onPaneDoubleClick
    reactFlowHandlers.onPaneClick = onPaneClick
    reactFlowHandlers.onConnect = onConnect
    reactFlowHandlers.onEdgeClick = onEdgeClick
    reactFlowHandlers.lastProps = props
    return <div data-testid="reactflow-root">{children}</div>
  },
  Background: () => null,
  BackgroundVariant: { Dots: 'dots' },
  Handle: () => null,
  Position: { Top: 'top', Right: 'right', Bottom: 'bottom', Left: 'left' },
  applyNodeChanges: (changes, nodes) => {
    if (!Array.isArray(changes) || !Array.isArray(nodes)) {
      return nodes
    }
    return nodes.map((node) => {
      const nodeChange = changes.find((change) => change?.id === node.id)
      if (!nodeChange) {
        return node
      }
      if (nodeChange.type === 'position') {
        return {
          ...node,
          position: nodeChange.position ?? node.position,
          dragging: Boolean(nodeChange.dragging),
        }
      }
      return node
    })
  },
}))

vi.mock('../../lib/construction/constructionStore', () => ({
  loadConstructionSession: storeMocks.loadConstructionSession,
  saveConstructionSession: storeMocks.saveConstructionSession,
}))

vi.mock('../../data', () => ({
  getAllEntities: dataMocks.getAllEntities,
}))

function createDataTransfer() {
  const storage = new Map()
  return {
    setData: (key, value) => storage.set(key, value),
    getData: (key) => storage.get(key) ?? '',
  }
}

function canonicalFixtures() {
  return [
    {
      id: 'concept-a',
      layer: 'concept',
      title: 'Concept A',
      domain: 'mechanics',
      tags: ['topic-1'],
      review_state: 'published',
      mass: 1,
    },
    {
      id: 'variable-b',
      layer: 'variable',
      name: 'Variable B',
      canonical_symbol: 'b',
      domain: 'mechanics',
      tags: ['topic-1'],
      review_state: 'published',
    },
    {
      id: 'draft-concept',
      layer: 'concept',
      title: 'Draft Concept',
      domain: 'mechanics',
      tags: ['topic-2'],
      review_state: 'draft',
    },
  ]
}

describe('ConstructionCanvas Session 4 behaviors', () => {
  beforeEach(() => {
    reactFlowHandlers.onNodesChange = null
    reactFlowHandlers.onNodeDragStop = null
    reactFlowHandlers.onNodeContextMenu = null
    reactFlowHandlers.onNodeClick = null
    reactFlowHandlers.onPaneDoubleClick = null
    reactFlowHandlers.onPaneClick = null
    reactFlowHandlers.onConnect = null
    reactFlowHandlers.onEdgeClick = null
    reactFlowHandlers.lastProps = null
    storeMocks.loadConstructionSession.mockReset()
    storeMocks.saveConstructionSession.mockReset()
    dataMocks.getAllEntities.mockReset()
    dataMocks.getAllEntities.mockReturnValue(canonicalFixtures())
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-4',
      title: 'Session 4 map',
      positions: {},
      canonical_nodes: [],
      edges: [],
      library_source: null,
    })
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('T3: lists published nodes, places via drag-drop, dims bank entry, and unplaces with touching-edge cleanup', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-4',
      title: 'Session 4 map',
      positions: {},
      canonical_nodes: [],
      edges: [{ id: 'edge-1', source: 'concept-a', target: 'variable-b' }],
      library_source: null,
    })

    const { container } = render(<ConstructionCanvas sessionId="session-4" />)

    expect(screen.getByText('Concept A')).toBeTruthy()
    expect(screen.getByText('Variable B')).toBeTruthy()
    expect(screen.queryByText('Draft Concept')).toBeNull()

    const conceptBankItem = screen.getByText('Concept A').closest('div[draggable]')
    const canvasDropZone = screen.getByTestId('reactflow-root').parentElement
    expect(conceptBankItem).toBeTruthy()
    expect(canvasDropZone).toBeTruthy()

    const dataTransfer = createDataTransfer()
    fireEvent.dragStart(conceptBankItem, { dataTransfer })
    fireEvent.drop(canvasDropZone, { dataTransfer, clientX: 120, clientY: 210 })

    await waitFor(() => {
      expect(storeMocks.saveConstructionSession).toHaveBeenCalled()
    })
    const placedSnapshot = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
    expect(placedSnapshot.positions['concept-a']).toEqual({ x: 0, y: 0 })
    expect(placedSnapshot.canonical_nodes).toContain('concept-a')

    const dimmedConceptBankItem = screen.getByText('Concept A').closest('div[draggable]')
    expect(dimmedConceptBankItem?.getAttribute('draggable')).toBe('false')

    const variableBankItem = screen.getByText('Variable B').closest('div[draggable]')
    const variableTransfer = createDataTransfer()
    fireEvent.dragStart(variableBankItem, { dataTransfer: variableTransfer })
    fireEvent.drop(canvasDropZone, { dataTransfer: variableTransfer, clientX: 260, clientY: 140 })

    await waitFor(() => {
      const secondPlacement = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      expect(secondPlacement.positions['variable-b']).toEqual({ x: 0, y: 0 })
    })

    act(() => {
      reactFlowHandlers.onNodeContextMenu?.(
        { preventDefault: () => {}, clientX: 200, clientY: 180 },
        { id: 'concept-a' },
      )
    })

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    await waitFor(() => {
      const unplacedSnapshot = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      expect(unplacedSnapshot.positions['concept-a']).toBeUndefined()
      expect(unplacedSnapshot.edges).toEqual([])
    })
    expect(confirmSpy).toHaveBeenCalled()

    const restoredConceptBankItem = screen.getByText('Concept A').closest('div[draggable]')
    expect(restoredConceptBankItem?.getAttribute('draggable')).toBe('true')
    expect(container.querySelector('[aria-label="Toggle node bank"]')).toBeTruthy()
  })

  it('T7 partial: position changes save and restore from localStorage on reload', async () => {
    let persistedSession = {
      id: 'session-restore',
      title: 'Restore map',
      positions: {},
      canonical_nodes: [],
      edges: [],
      library_source: null,
    }

    storeMocks.loadConstructionSession.mockImplementation(() => persistedSession)
    storeMocks.saveConstructionSession.mockImplementation((next) => {
      persistedSession = JSON.parse(JSON.stringify(next))
    })

    const { unmount } = render(<ConstructionCanvas sessionId="session-restore" />)
    const bankItem = screen.getByText('Variable B').closest('div[draggable]')
    const canvasDropZone = screen.getByTestId('reactflow-root').parentElement
    const dataTransfer = createDataTransfer()

    fireEvent.dragStart(bankItem, { dataTransfer })
    fireEvent.drop(canvasDropZone, { dataTransfer, clientX: 40, clientY: 60 })

    await waitFor(() => {
      expect(persistedSession.positions['variable-b']).toEqual({ x: 0, y: 0 })
    })

    act(() => {
      reactFlowHandlers.onNodeDragStop?.({}, { id: 'variable-b', position: { x: 300, y: 420 } })
    })

    await waitFor(() => {
      expect(persistedSession.positions['variable-b']).toEqual({ x: 300, y: 420 })
    })

    unmount()
    render(<ConstructionCanvas sessionId="session-restore" />)

    await waitFor(() => {
      const reloadedNode = (reactFlowHandlers.lastProps?.nodes ?? []).find((node) => node.id === 'variable-b')
      expect(reloadedNode?.position).toEqual({ x: 300, y: 420 })
    })
  })

  it('updates node position continuously during drag and persists on drag stop', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-smooth',
      title: 'Smooth map',
      positions: { 'variable-b': { x: 10, y: 20 } },
      canonical_nodes: ['variable-b'],
      edges: [],
      library_source: null,
    })

    render(<ConstructionCanvas sessionId="session-smooth" />)

    await waitFor(() => {
      const positionedNode = (reactFlowHandlers.lastProps?.nodes ?? []).find((node) => node.id === 'variable-b')
      expect(positionedNode?.position).toEqual({ x: 10, y: 20 })
    })

    act(() => {
      reactFlowHandlers.onNodesChange?.([
        {
          id: 'variable-b',
          type: 'position',
          position: { x: 140, y: 260 },
          dragging: true,
        },
      ])
    })

    await waitFor(() => {
      const movedNode = (reactFlowHandlers.lastProps?.nodes ?? []).find((node) => node.id === 'variable-b')
      expect(movedNode?.position).toEqual({ x: 140, y: 260 })
    })
    expect(storeMocks.saveConstructionSession).not.toHaveBeenCalled()

    act(() => {
      reactFlowHandlers.onNodeDragStop?.({}, { id: 'variable-b', position: { x: 140, y: 260 } })
    })

    await waitFor(() => {
      const saved = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      expect(saved.positions['variable-b']).toEqual({ x: 140, y: 260 })
    })
  })

  it('T4: double-click creates a student node with student- id at click coordinates', async () => {
    render(<ConstructionCanvas sessionId="session-4" />)

    act(() => {
      reactFlowHandlers.onPaneDoubleClick?.(
        { preventDefault: () => {}, clientX: 320, clientY: 180 },
        null,
      )
    })

    expect(screen.getByText('Create student node')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My student idea' } })
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Some notes' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      const saved = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      expect(saved.student_nodes).toHaveLength(1)
      expect(saved.student_nodes[0].id.startsWith('student-')).toBe(true)
      expect(saved.student_nodes[0].title).toBe('My student idea')
      expect(saved.positions[saved.student_nodes[0].id]).toEqual({ x: 320, y: 180 })
    })
  })

  it('T4: + New node creates unplaced student bank node that can be dragged to place', async () => {
    render(<ConstructionCanvas sessionId="session-4" />)

    fireEvent.click(screen.getByRole('button', { name: '+ New node' }))
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Bank student node' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      const saved = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      const createdId = saved.student_nodes[0].id
      expect(saved.positions[createdId]).toBeUndefined()
      expect(screen.getByText('Bank student node')).toBeTruthy()
    })

    const bankItem = screen.getByText('Bank student node').closest('div[draggable]')
    const canvasDropZone = screen.getByTestId('reactflow-root').parentElement
    const dataTransfer = createDataTransfer()
    fireEvent.dragStart(bankItem, { dataTransfer })
    fireEvent.drop(canvasDropZone, { dataTransfer, clientX: 75, clientY: 90 })

    await waitFor(() => {
      const saved = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      const createdId = saved.student_nodes[0].id
      expect(saved.positions[createdId]).toEqual({ x: 0, y: 0 })
    })
  })

  it('T4: student optional fields persist after close and reopen', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-student-edit',
      title: 'Student edit map',
      student_nodes: [
        {
          id: 'student-existing',
          title: 'Existing student',
          created_at: '2026-04-26T10:00:00.000Z',
          modified_at: '2026-04-26T10:00:00.000Z',
          field_order: [],
          content: {
            notes: '',
            formula: null,
            description: null,
            simplifying_assumption: null,
            applicability: null,
            misconception: null,
          },
          color: null,
        },
      ],
      positions: { 'student-existing': { x: 20, y: 40 } },
      canonical_nodes: [],
      edges: [],
      library_source: null,
    })

    let persisted = storeMocks.loadConstructionSession.mock.results[0]?.value
    storeMocks.saveConstructionSession.mockImplementation((next) => {
      persisted = JSON.parse(JSON.stringify(next))
      storeMocks.loadConstructionSession.mockReturnValue(persisted)
    })

    const { unmount } = render(<ConstructionCanvas sessionId="session-student-edit" />)

    act(() => {
      reactFlowHandlers.onNodeClick?.({}, { id: 'student-existing' })
    })
    expect(screen.getByText('Edit student node')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '+ Add Formula' }))
    fireEvent.click(screen.getByRole('button', { name: '+ Add Description' }))
    const notesInput = screen.getByLabelText('Notes')
    const formulaInput = screen.getByLabelText('Formula')
    const descriptionInput = screen.getByLabelText('Description')

    fireEvent.change(formulaInput, { target: { value: 'E=mc^2' } })
    fireEvent.blur(formulaInput)
    fireEvent.change(descriptionInput, { target: { value: 'Mass-energy relation' } })
    fireEvent.blur(descriptionInput)
    fireEvent.change(notesInput, { target: { value: 'Persistent notes' } })
    fireEvent.blur(notesInput)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    act(() => {
      reactFlowHandlers.onNodeClick?.({}, { id: 'student-existing' })
    })

    expect(screen.getByDisplayValue('Persistent notes')).toBeTruthy()
    expect(screen.getByDisplayValue('E=mc^2')).toBeTruthy()
    expect(screen.getByDisplayValue('Mass-energy relation')).toBeTruthy()

    unmount()
    render(<ConstructionCanvas sessionId="session-student-edit" />)
    act(() => {
      reactFlowHandlers.onNodeClick?.({}, { id: 'student-existing' })
    })
    expect(screen.getByDisplayValue('Persistent notes')).toBeTruthy()
  })

  it('T4: student node click opens student panel while canonical click does not', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-clicks',
      title: 'Clicks map',
      student_nodes: [
        {
          id: 'student-click',
          title: 'Student click',
          created_at: '2026-04-26T10:00:00.000Z',
          modified_at: '2026-04-26T10:00:00.000Z',
          field_order: [],
          content: { notes: '', formula: null, description: null, simplifying_assumption: null, applicability: null, misconception: null },
          color: null,
        },
      ],
      positions: { 'student-click': { x: 20, y: 20 }, 'concept-a': { x: 10, y: 10 } },
      canonical_nodes: ['concept-a'],
      edges: [],
      library_source: null,
    })

    render(<ConstructionCanvas sessionId="session-clicks" />)

    act(() => {
      reactFlowHandlers.onNodeClick?.({}, { id: 'concept-a' })
    })
    expect(screen.queryByText('Edit student node')).toBeNull()

    act(() => {
      reactFlowHandlers.onNodeClick?.({}, { id: 'student-click' })
    })
    expect(screen.getByText('Edit student node')).toBeTruthy()
  })

  it('maps construction session edges into react flow edges', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-edges',
      title: 'Edges map',
      positions: { 'concept-a': { x: 10, y: 10 }, 'variable-b': { x: 20, y: 20 } },
      canonical_nodes: ['concept-a', 'variable-b'],
      edges: [{ id: 'edge-canonical', source: 'concept-a', target: 'variable-b' }],
      library_source: null,
    })

    render(<ConstructionCanvas sessionId="session-edges" />)

    await waitFor(() => {
      expect(Array.isArray(reactFlowHandlers.lastProps?.edges)).toBe(true)
      expect(reactFlowHandlers.lastProps?.edges).toHaveLength(1)
      expect(reactFlowHandlers.lastProps?.edges[0].id).toBe('edge-canonical')
    })
  })

  it('T4b: rejects self-loop edges during connect with toast and no save', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-self-loop',
      title: 'Self loop map',
      positions: { 'concept-a': { x: 10, y: 10 } },
      canonical_nodes: ['concept-a'],
      edges: [],
      library_source: null,
    })
    render(<ConstructionCanvas sessionId="session-self-loop" />)

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'concept-a', target: 'concept-a' })
    })

    expect(screen.getByText('A node cannot connect to itself.')).toBeTruthy()
    expect(storeMocks.saveConstructionSession).not.toHaveBeenCalled()
  })

  it('T4b: rejects duplicate unordered pair during connect with toast and no save', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-duplicate',
      title: 'Duplicate map',
      positions: { 'concept-a': { x: 10, y: 10 }, 'variable-b': { x: 20, y: 20 } },
      canonical_nodes: ['concept-a', 'variable-b'],
      edges: [{ id: 'edge-existing', source: 'concept-a', target: 'variable-b', explanation: null, explanation_filled: false }],
      library_source: null,
    })
    render(<ConstructionCanvas sessionId="session-duplicate" />)

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'variable-b', target: 'concept-a' })
    })

    expect(screen.getByText('A connection between these nodes already exists.')).toBeTruthy()
    expect(storeMocks.saveConstructionSession).not.toHaveBeenCalled()
  })

  it('T5: edge create opens popover and save marks explanation_filled true', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-explain',
      title: 'Explain map',
      positions: { 'concept-a': { x: 10, y: 10 }, 'variable-b': { x: 200, y: 200 } },
      canonical_nodes: ['concept-a', 'variable-b'],
      edges: [],
      library_source: null,
    })
    render(<ConstructionCanvas sessionId="session-explain" />)

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'concept-a', target: 'variable-b' })
    })

    await waitFor(() => {
      const created = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      expect(created.edges).toHaveLength(1)
      expect(created.edges[0].explanation).toBeNull()
      expect(created.edges[0].explanation_filled).toBe(false)
    })

    expect(screen.getByText('Explain the connection')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Edge explanation'), { target: { value: 'Concept drives variable behavior.' } })
    const explanationDialog = screen.getByRole('dialog', { name: 'Explain the connection' })
    fireEvent.click(within(explanationDialog).getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      const saved = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      expect(saved.edges[0].explanation).toBe('Concept drives variable behavior.')
      expect(saved.edges[0].explanation_filled).toBe(true)
    })
  })

  it('T5: skip keeps explanation null and shows unfilled badge count', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-skip',
      title: 'Skip map',
      positions: { 'concept-a': { x: 10, y: 10 }, 'variable-b': { x: 200, y: 200 } },
      canonical_nodes: ['concept-a', 'variable-b'],
      edges: [],
      library_source: null,
    })
    render(<ConstructionCanvas sessionId="session-skip" />)

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'concept-a', target: 'variable-b' })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }))

    await waitFor(() => {
      const saved = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      expect(saved.edges[0].explanation).toBeNull()
      expect(saved.edges[0].explanation_filled).toBe(false)
      expect(screen.getByRole('button', { name: '1 edges without explanations' })).toBeTruthy()
    })
  })

  it('T5: badge click cycles through unfilled edges and opens explanation popover', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-badge-cycle',
      title: 'Badge map',
      student_nodes: [
        {
          id: 'student-a',
          title: 'Student A',
          created_at: '2026-04-26T10:00:00.000Z',
          modified_at: '2026-04-26T10:00:00.000Z',
          field_order: [],
          content: { notes: '', formula: null, description: null, simplifying_assumption: null, applicability: null, misconception: null },
          color: null,
        },
      ],
      positions: {
        'concept-a': { x: 0, y: 0 },
        'variable-b': { x: 200, y: 0 },
        'student-a': { x: 100, y: 150 },
      },
      canonical_nodes: ['concept-a', 'variable-b'],
      edges: [
        { id: 'edge-a', source: 'concept-a', target: 'variable-b', explanation: null, explanation_filled: false },
        { id: 'edge-b', source: 'variable-b', target: 'student-a', explanation: null, explanation_filled: false },
      ],
      library_source: null,
    })
    render(<ConstructionCanvas sessionId="session-badge-cycle" />)

    const badge = screen.getByRole('button', { name: '2 edges without explanations' })
    expect(badge.getAttribute('aria-live')).toBe('polite')
    fireEvent.click(badge)
    expect(screen.getByText('Concept A - Variable B')).toBeTruthy()
    fireEvent.click(badge)
    expect(screen.getByText('Variable B - Student A')).toBeTruthy()
  })

  it('T6: persists all four node-type edge combinations with correct source/target ids', async () => {
    storeMocks.loadConstructionSession.mockReturnValue({
      id: 'session-type-combos',
      title: 'Type combos',
      student_nodes: [
        {
          id: 'student-a',
          title: 'Student A',
          created_at: '2026-04-26T10:00:00.000Z',
          modified_at: '2026-04-26T10:00:00.000Z',
          field_order: [],
          content: { notes: '', formula: null, description: null, simplifying_assumption: null, applicability: null, misconception: null },
          color: null,
        },
        {
          id: 'student-b',
          title: 'Student B',
          created_at: '2026-04-26T10:00:00.000Z',
          modified_at: '2026-04-26T10:00:00.000Z',
          field_order: [],
          content: { notes: '', formula: null, description: null, simplifying_assumption: null, applicability: null, misconception: null },
          color: null,
        },
      ],
      positions: {
        'concept-a': { x: 0, y: 0 },
        'variable-b': { x: 200, y: 0 },
        'student-a': { x: 0, y: 180 },
        'student-b': { x: 200, y: 180 },
      },
      canonical_nodes: ['concept-a', 'variable-b'],
      edges: [],
      library_source: null,
    })
    render(<ConstructionCanvas sessionId="session-type-combos" />)

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'concept-a', target: 'variable-b' })
    })
    await waitFor(() => {
      expect(storeMocks.saveConstructionSession.mock.calls).toHaveLength(1)
    })

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'concept-a', target: 'student-a' })
    })
    await waitFor(() => {
      expect(storeMocks.saveConstructionSession.mock.calls).toHaveLength(2)
    })

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'student-b', target: 'variable-b' })
    })
    await waitFor(() => {
      expect(storeMocks.saveConstructionSession.mock.calls).toHaveLength(3)
    })

    act(() => {
      reactFlowHandlers.onConnect?.({ source: 'student-a', target: 'student-b' })
    })

    await waitFor(() => {
      const saved = storeMocks.saveConstructionSession.mock.calls.at(-1)[0]
      const pairs = saved.edges.map((edge) => `${edge.source}->${edge.target}`)
      expect(pairs).toContain('concept-a->variable-b')
      expect(pairs).toContain('concept-a->student-a')
      expect(pairs).toContain('student-b->variable-b')
      expect(pairs).toContain('student-a->student-b')
    })
  })
})
