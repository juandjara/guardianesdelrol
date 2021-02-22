import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Select({
  className = '',
  optionsClassname = '',
  label = '',
  selected,
  options = [],
  position = 'top',
  onChange = () => {}
}) {
  function getBackground(active, opt) {
    const isSelected = opt.value === selected?.value
    if (isSelected) {
      return 'bg-red-300'
    }
    if (active) {
      return 'bg-red-200'
    }
    return 'bg-red-100 hover:bg-red-200'
  }

  function getBorder(i) {
    if (i === 0) {
      return 'rounded-t-md'
    }
    if (i === options.length - 1) {
      return 'rounded-b-md'
    }
    return ''
  }

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          {label && <Listbox.Label>{label}</Listbox.Label>}
          <Listbox.Button
            className={`${className} bg-red-200 text-gray-700 py-2 pl-3 pr-2 rounded flex items-center justify-between space-x-3`}>
            {String(selected?.label) ? (
              <span className="font-semibold">{selected.label}</span>
            ) : (
              <span className="font-medium">Selecciona una opcion...</span>
            )}
            <svg
              className="text-red-900"
              height={20}
              width={20}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </Listbox.Button>
          <Transition
            show={open}
            enter={`transition origin-${position} ease-in-out`}
            enterFrom="transform scale-y-50 opacity-0"
            enterTo="transform scale-y-100 opacity-100"
            leave={`transition origin-${position} ease-in-out`}
            leaveFrom="transform scale-y-100 opacity-100"
            leaveTo="transform scale-y-50 opacity-0">
            <Listbox.Options className={`${optionsClassname} text-gray-700 mt-2 rounded-md`} static>
              {options.map((opt, i) => (
                <Listbox.Option as={Fragment} key={opt.value} value={opt} disabled={opt.disabled}>
                  {({ active }) => (
                    <li
                      className={`${getBorder(i)} ${getBackground(
                        active,
                        opt
                      )} py-2 px-4 cursor-pointer`}>
                      {opt.label}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
