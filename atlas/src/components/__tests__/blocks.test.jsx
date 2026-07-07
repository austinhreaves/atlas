// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import EmbedIframeBlock from '../blocks/EmbedIframeBlock'
import FileAttachmentBlock from '../blocks/FileAttachmentBlock'
import ImageBlock from '../blocks/ImageBlock'
import {
  ChecklistBlockEditor,
  ChecklistBlockRender,
} from '../blocks/ChecklistBlock'
import MarkdownKatexBlock from '../blocks/MarkdownKatexBlock'
import {
  PromptResponseBlockEditor,
  PromptResponseBlockRender,
} from '../blocks/PromptResponseBlock'
import TableBlock from '../blocks/TableBlock'

describe('block components', () => {
  it('renders markdown + katex while treating script-like text as plain text', () => {
    const panel = render(
      <MarkdownKatexBlock
        data={{
          markdown: '# Heading\n- item with $E=mc^2$\n<script>alert("x")</script>',
        }}
      />,
    )

    expect(panel.getByText('Heading')).not.toBeNull()
    expect(panel.container.querySelector('.katex')).not.toBeNull()
    expect(panel.container.querySelector('script')).toBeNull()
    expect(panel.container.textContent).toContain('<script>alert("x")</script>')
  })

  it('renders image block', () => {
    const panel = render(
      <ImageBlock
        data={{
          src: 'https://example.com/image.png',
          alt: 'Example image',
          caption: 'A caption',
        }}
      />,
    )

    const image = panel.getByAltText('Example image')
    expect(image.getAttribute('src')).toContain('https://example.com/image.png')
    expect(panel.getByText('A caption')).not.toBeNull()
  })

  it('renders table block', () => {
    const panel = render(
      <TableBlock
        data={{
          columns: ['Quantity', 'Value'],
          rows: [['Current', '2 A']],
        }}
      />,
    )
    expect(panel.getByText('Quantity')).not.toBeNull()
    expect(panel.getByText('2 A')).not.toBeNull()
  })

  it('renders file attachment block', () => {
    const panel = render(
      <FileAttachmentBlock
        data={{
          label: 'Worksheet',
          url: 'https://example.com/file.pdf',
        }}
      />,
    )
    const link = panel.getByRole('link', { name: 'Worksheet' })
    expect(link.getAttribute('href')).toContain('https://example.com/file.pdf')
  })

  it('renders allowlisted iframe and blocks non-allowlisted URLs', () => {
    const allowed = render(
      <EmbedIframeBlock
        data={{
          title: 'PhET',
          url: 'https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html',
        }}
      />,
    )
    expect(allowed.container.querySelector('iframe')).not.toBeNull()

    const blocked = render(
      <EmbedIframeBlock
        data={{
          url: 'javascript:alert(1)',
        }}
      />,
    )
    expect(blocked.container.querySelector('iframe')).toBeNull()
    expect(blocked.container.textContent).toContain('Embed blocked')
  })

  it('renders and edits checklist block safely', () => {
    let latestState = {}
    const data = {
      items: [
        { id: 'item-1', text: 'Measure voltage' },
        { id: 'item-2', text: 'Record value' },
      ],
    }

    const renderView = render(<ChecklistBlockRender data={data} userState={latestState} />)
    expect(renderView.container.querySelectorAll('input[type="checkbox"]')).toHaveLength(2)

    const editor = render(
      <ChecklistBlockEditor
        data={data}
        userState={latestState}
        onUserStateChange={(nextState) => {
          latestState = nextState
          editor.rerender(
            <ChecklistBlockEditor data={data} userState={latestState} onUserStateChange={() => {}} />,
          )
        }}
      />,
    )

    const firstCheckbox = editor.container.querySelector('input[type="checkbox"]')
    fireEvent.click(firstCheckbox)
    expect(latestState).toEqual({ checkedByItemId: { 'item-1': true } })
  })

  it('renders and edits prompt-response as plain text', () => {
    let latestState = { responseText: '' }
    const data = { prompt: 'What happened?', placeholder: 'Type here' }

    const renderView = render(<PromptResponseBlockRender data={data} userState={latestState} />)
    expect(renderView.getByText('What happened?')).not.toBeNull()

    const editor = render(
      <PromptResponseBlockEditor
        data={data}
        userState={latestState}
        onUserStateChange={(nextState) => {
          latestState = nextState
          editor.rerender(
            <PromptResponseBlockEditor
              data={data}
              userState={latestState}
              onUserStateChange={() => {}}
            />,
          )
        }}
      />,
    )

    fireEvent.change(editor.getByRole('textbox'), {
      target: { value: '<img src=x onerror=alert(1) />' },
    })
    expect(latestState.responseText).toBe('<img src=x onerror=alert(1) />')

    const hostileRender = render(
      <PromptResponseBlockRender data={data} userState={{ responseText: latestState.responseText }} />,
    )
    expect(hostileRender.container.querySelector('img')).toBeNull()
    expect(hostileRender.container.textContent).toContain('<img src=x onerror=alert(1) />')
  })
})

