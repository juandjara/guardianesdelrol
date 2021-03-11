import Quill from 'quill'
import MagicUrl from 'quill-magic-url'
import BlotFormatter from 'quill-blot-formatter-mobile'
import CustomImageFactory from '@/lib/images/CustomImage'
import { useQuill } from 'react-quilljs'
import { useEffect } from 'react'
import uploadImage from '@/lib/images/uploadImage'

Quill.register('modules/magicUrl', MagicUrl)
Quill.register('modules/blotFormatter', BlotFormatter)
Quill.register('formats/image', CustomImageFactory(Quill))

export default function TextEditor({ imageEditorPath = '', className = '', value = '', onChange }) {
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
    function selectImage() {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      input.onchange = () => {
        const file = input.files[0]
        const reader = new FileReader()
        reader.onload = ev => {
          const url = ev.target.result
          handleImageURL({ url, filename: file.name })
        }
        reader.readAsDataURL(file)
      }
    }

    async function handleImageURL({ url, filename }) {
      const savedFilename = await uploadImage({ url, filename, folder: imageEditorPath })
      const fullurl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${imageEditorPath}/${savedFilename}`
      const selection = quill.getSelection()
      quill.insertEmbed(selection.index, 'image', fullurl)
    }

    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectImage)
    }
  }, [quill, imageEditorPath])

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
      quill.blur()
      window.scrollTo(0, 0)
    }
  }, [quill, value])

  return (
    <div className={`${className}`}>
      <div ref={quillRef}></div>
    </div>
  )
}
