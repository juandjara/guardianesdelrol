import { useEffect, useRef } from 'react'
import CustomImageFactory from '@/lib/CustomImage'
import 'quill/dist/quill.snow.css'

export default function TextEditor({ value }) {
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
    }
    if (!editor.current) {
      wrapperRef.current.ready = true
      renderEditor()
    }
  }, [])

  return (
    <div ref={wrapperRef}>
      <span dangerouslySetInnerHTML={{ __html: value }}></span>
    </div>
  )
}
