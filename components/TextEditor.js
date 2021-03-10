import Quill from 'quill'
import MagicUrl from 'quill-magic-url'
import BlotFormatter from 'quill-blot-formatter-mobile'
import CustomImageFactory from '@/lib/images/CustomImage'
import { useQuill } from 'react-quilljs'
import { useEffect } from 'react'

import 'quill/dist/quill.snow.css'

Quill.register('modules/magicUrl', MagicUrl)
Quill.register('modules/blotFormatter', BlotFormatter)
Quill.register('formats/image', CustomImageFactory(Quill))

export default function TextEditor({ className = '', value = '', onChange }) {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      magicUrl: true,
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
      if (typeof value === 'string') {
        quill.clipboard.dangerouslyPasteHTML(value)
      } else {
        quill.setContents(value)
      }
    }
  }, [quill, value])

  return (
    <div className={className}>
      <div ref={quillRef}></div>
    </div>
  )
}
