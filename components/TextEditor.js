import CustomImageFactory from '@/lib/CustomImage'
import 'quill/dist/quill.snow.css'

import Quill from 'quill'
import BlotFormatter from 'quill-blot-formatter-mobile'
import { useQuill } from 'react-quilljs'
import { useEffect } from 'react'

Quill.register('modules/blotFormatter', BlotFormatter)
Quill.register('formats/image', CustomImageFactory(Quill))

export default function TextEditor({ value = '', onChange }) {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
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

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (newDelta, oldDelta, source) => {
        if (source === 'user') {
          onChange(quill.root.innerHTML)
        }
      })
    }
  }, [quill, onChange])

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value)
    }
  }, [quill, value])

  return (
    <div>
      <div ref={quillRef}></div>
    </div>
  )
}
