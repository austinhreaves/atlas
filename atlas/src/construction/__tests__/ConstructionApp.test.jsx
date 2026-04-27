// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConstructionApp from '../ConstructionApp.jsx'

const mocks = vi.hoisted(() => ({
  listConstructionSessions: vi.fn(),
  loadConstructionSession: vi.fn(),
  saveConstructionSession: vi.fn(),
  createConstructionSession: vi.fn(),
  deserializeConstructionFile: vi.fn(),
  validateConstructionFile: vi.fn(),
  fetchInstructorManifest: vi.fn(),
  fetchInstructorMapFile: vi.fn(),
  buildTopicCatalog: vi.fn(),
  buildSessionFromInstructorMap: vi.fn(),
  buildSessionFromTopicSubgraph: vi.fn(),
  buildSessionFromBlankTemplate: vi.fn(),
}))

vi.mock('../../lib/construction/constructionStore', () => ({
  listConstructionSessions: mocks.listConstructionSessions,
  loadConstructionSession: mocks.loadConstructionSession,
  saveConstructionSession: mocks.saveConstructionSession,
}))

vi.mock('../../lib/construction/constructionFile', () => ({
  createConstructionSession: mocks.createConstructionSession,
  deserializeConstructionFile: mocks.deserializeConstructionFile,
}))

vi.mock('../../lib/construction/validateConstructionFile', () => ({
  validateConstructionFile: mocks.validateConstructionFile,
}))

vi.mock('../../lib/construction/libraryCatalog', () => ({
  fetchInstructorManifest: mocks.fetchInstructorManifest,
  fetchInstructorMapFile: mocks.fetchInstructorMapFile,
  buildTopicCatalog: mocks.buildTopicCatalog,
}))

vi.mock('../../lib/construction/librarySessionBuilders', () => ({
  buildSessionFromInstructorMap: mocks.buildSessionFromInstructorMap,
  buildSessionFromTopicSubgraph: mocks.buildSessionFromTopicSubgraph,
  buildSessionFromBlankTemplate: mocks.buildSessionFromBlankTemplate,
}))

vi.mock('../ConstructionCanvas.jsx', () => ({
  default: ({ sessionId }) => <div data-testid="construction-canvas-mock">Canvas session: {sessionId}</div>,
}))

describe('ConstructionApp', () => {
  beforeEach(() => {
    mocks.listConstructionSessions.mockReset()
    mocks.loadConstructionSession.mockReset()
    mocks.saveConstructionSession.mockReset()
    mocks.createConstructionSession.mockReset()
    mocks.deserializeConstructionFile.mockReset()
    mocks.validateConstructionFile.mockReset()
    mocks.fetchInstructorManifest.mockReset()
    mocks.fetchInstructorMapFile.mockReset()
    mocks.buildTopicCatalog.mockReset()
    mocks.buildSessionFromInstructorMap.mockReset()
    mocks.buildSessionFromTopicSubgraph.mockReset()
    mocks.buildSessionFromBlankTemplate.mockReset()
    mocks.listConstructionSessions.mockReturnValue([])
    mocks.buildTopicCatalog.mockReturnValue([
      { domain: 'mechanics', topic: 'topic-a', nodeCount: 2 },
    ])
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('starts from scratch and navigates to canvas stub', async () => {
    const created = { id: 'session-new', title: 'Untitled concept map' }
    mocks.createConstructionSession.mockReturnValue(created)
    render(<ConstructionApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Start' }))

    expect(mocks.saveConstructionSession).toHaveBeenCalledWith(created)
    await waitFor(() => {
      expect(screen.getByTestId('construction-canvas-mock')).toBeTruthy()
      expect(screen.getByText('Canvas session: session-new')).toBeTruthy()
    })
  })

  it('shows saved sessions and continues into selected session', async () => {
    mocks.listConstructionSessions.mockReturnValue([
      { id: 'session-1', title: 'My map', modifiedAt: '2026-04-26T10:00:00.000Z', submitted: false },
    ])
    mocks.loadConstructionSession.mockReturnValue({ id: 'session-1', title: 'My map' })
    render(<ConstructionApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => {
      expect(screen.getByText('Canvas session: session-1')).toBeTruthy()
    })
  })

  it('blocks import when validator returns hard errors', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    mocks.deserializeConstructionFile.mockReturnValue({ id: 'session-import' })
    mocks.validateConstructionFile.mockReturnValue({
      errors: ['format / format_version unrecognized'],
      warnings: [],
      file: { id: 'session-import' },
    })

    render(<ConstructionApp />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.atlas-map.json', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: vi.fn().mockResolvedValue('{}') })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled()
      expect(mocks.saveConstructionSession).not.toHaveBeenCalled()
    })
  })

  it('requires acknowledgment for warnings before import continues', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    mocks.deserializeConstructionFile.mockReturnValue({ id: 'session-import' })
    mocks.validateConstructionFile.mockReturnValue({
      errors: [],
      warnings: ['canonical_nodes diverges from positions keys'],
      file: { id: 'session-import' },
    })

    render(<ConstructionApp />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.atlas-map.json', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: vi.fn().mockResolvedValue('{}') })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled()
      expect(mocks.saveConstructionSession).toHaveBeenCalledWith({ id: 'session-import' })
    })
  })

  it('loads topic subgraph from library and opens canvas', async () => {
    const built = {
      id: 'session-topic',
      positions: { 'ohms-law': { x: 10, y: 20 } },
      canonical_nodes: ['ohms-law'],
      edges: [],
      library_source: { type: 'topic-subgraph', topic: 'topic-a' },
    }
    mocks.fetchInstructorManifest.mockResolvedValue({ entries: [], unavailable: true })
    mocks.buildSessionFromTopicSubgraph.mockReturnValue(built)
    render(<ConstructionApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Open library' }))
    await waitFor(() => {
      expect(screen.getByText('Topic subgraphs')).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Topic subgraphs' }))
    fireEvent.click(screen.getByRole('button', { name: 'Load' }))

    await waitFor(() => {
      expect(mocks.saveConstructionSession).toHaveBeenCalledWith(built)
      expect(screen.getByText('Canvas session: session-topic')).toBeTruthy()
    })
  })

  it('loads blank template from library and opens canvas', async () => {
    const built = {
      id: 'session-blank',
      positions: {},
      canonical_nodes: [],
      edges: [],
      library_source: { type: 'blank-template', topic: 'topic-a' },
    }
    mocks.fetchInstructorManifest.mockResolvedValue({ entries: [], unavailable: true })
    mocks.buildSessionFromBlankTemplate.mockReturnValue(built)
    render(<ConstructionApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Open library' }))
    await waitFor(() => {
      expect(screen.getByText('Blank templates')).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Blank templates' }))
    fireEvent.click(screen.getByRole('button', { name: 'Load' }))

    await waitFor(() => {
      expect(mocks.saveConstructionSession).toHaveBeenCalledWith(built)
      expect(screen.getByText('Canvas session: session-blank')).toBeTruthy()
    })
  })

  it('shows no instructor maps available fallback when fetch fails', async () => {
    mocks.fetchInstructorManifest.mockResolvedValue({ entries: [], unavailable: true })
    render(<ConstructionApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Open library' }))
    await waitFor(() => {
      expect(screen.getByText('No instructor maps available.')).toBeTruthy()
    })
  })

  it('skips malformed instructor entries and still loads valid entry', async () => {
    const built = { id: 'session-instructor' }
    mocks.fetchInstructorManifest.mockResolvedValue({
      unavailable: false,
      entries: [{ id: 'valid', title: 'Valid map', file: 'valid.atlas-map.json', author: 'A' }],
    })
    mocks.fetchInstructorMapFile.mockResolvedValue({ title: 'Valid map' })
    mocks.buildSessionFromInstructorMap.mockReturnValue(built)
    render(<ConstructionApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Open library' }))
    await waitFor(() => {
      expect(screen.getByText('Valid map')).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Load' }))

    await waitFor(() => {
      expect(mocks.saveConstructionSession).toHaveBeenCalledWith(built)
    })
  })
})
