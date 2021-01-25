import { useState } from 'react'
import EyeIcon from './icons/EyeIcon'
import EyeOffIcon from './icons/EyeOffIcon'

export default function PasswordInput({
  inputRef,
  value = '',
  onChange = () => {},
  onValidityChange = () => {},
  showMeter = true,
  ...props
}) {
  const [score, setScore] = useState(0)
  const [hidden, setHidden] = useState(true)
  const type = hidden ? 'password' : 'text'

  async function handleChange(ev) {
    const pass = ev.target.value
    onChange(pass)
    const pwcheck = (await import('zxcvbn')).default
    const info = pwcheck(pass)
    const score = info.score + 1
    setScore(score)
    const invalid = pass && score < 3
    onValidityChange(!invalid)
  }

  function stepBackground(step) {
    if (!value || step > score) {
      return 'bg-gray-200'
    }
    if (score >= 4) {
      return 'bg-green-500'
    }
    if (score > 2) {
      return 'bg-yellow-500'
    }
    return 'bg-red-400'
  }

  const Icon = hidden ? EyeIcon : EyeOffIcon

  const scoreNames = ['Muy débil', 'Débil', 'Normal', 'Fuerte', 'Muy fuerte']

  return (
    <>
      <div className="relative">
        <input
          {...props}
          ref={inputRef}
          className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
          value={value}
          onChange={handleChange}
          type={type}
        />
        <button
          type="button"
          title={hidden ? 'Ver contraseña' : 'Ocultar contraseña'}
          onClick={() => setHidden(!hidden)}
          className="absolute top-2 right-2 transition-colors rounded-md text-gray-400 block hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
          <Icon width={24} height={24} />
        </button>
      </div>
      {showMeter && (
        <>
          <div className="flex mt-2 space-x-2">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="w-1/5">
                <div className={`h-2 rounded-lg transition-colors ${stepBackground(n)}`}></div>
              </div>
            ))}
          </div>
          {value && (
            <p className="text-xs text-gray-400 mt-1">
              Fuerza {score}: {scoreNames[score - 1]}
            </p>
          )}
        </>
      )}
    </>
  )
}
