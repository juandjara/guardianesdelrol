import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import makeAnimated from 'react-select/animated'

const components = { ...makeAnimated(), DropdownIndicator: null }

export default function TagsInput({ placeholder, value = [], onChange }) {
  const [inputValue, setInputValue] = useState('')

  function handleChange(value) {
    onChange(value)
  }

  function handleKeyDown(ev) {
    if (!inputValue) return
    switch (ev.key) {
      case 'Enter':
      case 'Tab':
        ev.stopPropagation()
        ev.preventDefault()
        onChange([...value, { label: inputValue, value: inputValue }])
        setInputValue('')
    }
  }

  return (
    <CreatableSelect
      className="react-select"
      components={components}
      isClearable
      isMulti
      menuIsOpen={false}
      placeholder={placeholder}
      onInputChange={setInputValue}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      inputValue={inputValue}
      value={value}
    />
  )
}
