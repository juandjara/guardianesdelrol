import { useEffect, useRef } from 'react'
import CustomImageFactory from '@/lib/CustomImage'
import 'quill/dist/quill.snow.css'

export default function TextEditor({ value, onChange }) {
  const wrapperRef = useRef(null)
  const editor = useRef(null)

  useEffect(() => {
    async function renderEditor() {
      const Quill = (await import('quill')).default
      const BlotFormatter = (await import('quill-blot-formatter-mobile')).default

      Quill.register('modules/blotFormatter', BlotFormatter)
      Quill.register('formats/image', CustomImageFactory(Quill))

      editor.current = new Quill(wrapperRef.current, {
        theme: 'snow',
        // formats: ['size', 'bold', 'italic', 'underline', 'strike', 'list', 'align', 'image', 'link'],
        modules: {
          blotFormatter: true,
          toolbar: [
            [{ size: ['small', false, 'large'] }],
            [
              'bold',
              'italic',
              'underline',
              'link',
              'image',
              'video',
              { align: [] },
              { list: 'ordered' },
              { list: 'bullet' }
            ]
          ]
        }
      })

      editor.current.on('text-change', function onTextChange(newDelta, oldDelta, source) {
        if (source === 'user') {
          onChange(editor.current.root.innerHTML)
        }
      })
    }
    if (!editor.current) {
      wrapperRef.current.ready = true
      renderEditor()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div ref={wrapperRef}>
      <div dangerouslySetInnerHTML={{ __html: value }}></div>
    </div>
  )
}
