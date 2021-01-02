export function getClassname({ hasIcon, outline, color, background, border, disabled }) {
  const defaultColor = outline ? 'text-white hover:text-red-900' : 'text-red-900'
  const _color = color || defaultColor

  const defaultBackground = outline ? 'bg-red-900 hover:bg-white' : 'bg-white hover:bg-red-100'
  const _background = background || defaultBackground

  const _border = border || 'border-current'
  const layout = hasIcon
    ? `flex justify-center items-center space-x-2 ${hasIcon === 'right' ? 'pr-3' : 'pl-3'}`
    : 'block'
  const focus =
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-transparent'
  const base = 'transition-colors px-4 py-2 m-2 text-md font-semibold rounded-md border-2'
  const _disabled = disabled ? 'opacity-50 pointer-events-none' : ''
  return `${_color} ${_background} ${_border} ${_disabled} ${layout} ${focus} ${base}`
}

export default function Button({
  className = '',
  children,
  hasIcon,
  outline,
  color,
  background,
  border,
  disabled,
  ...props
}) {
  const classes = `${className} ${getClassname({
    hasIcon,
    outline,
    color,
    background,
    border,
    disabled
  })}`
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
