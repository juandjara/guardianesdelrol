function getPadding({ hasIcon, small }) {
  let classes = ''
  if (small) {
    classes = hasIcon ? 'px-3 py-1.5' : 'px-3 py-1'
  } else {
    classes = 'px-4 py-2'
    if (hasIcon === 'left') classes += ' pl-3'
    if (hasIcon === 'right') classes += ' pr-3'
  }

  return classes
}

export function getClassname({ small, hasIcon, outline, color, background, border, disabled }) {
  const defaultColor = outline ? 'text-white hover:text-red-900' : 'text-red-900'
  const _color = color || defaultColor

  const defaultBackground = outline ? 'bg-red-900 hover:bg-white' : 'bg-white hover:bg-red-50'
  const _background = background || defaultBackground

  const _border = border || 'border-white'
  const layout = hasIcon ? `flex justify-center items-center space-x-2` : 'block'
  const focus =
    'focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent'
  const padding = getPadding({ hasIcon, small })
  const font = small ? 'text-sm font-medium' : 'text-base font-semibold'
  const base = 'transition-colors rounded-md border-2'
  const _disabled = disabled ? 'opacity-50 pointer-events-none' : ''
  return `${_color} ${_background} ${padding} ${_border} ${_disabled} ${font} ${layout} ${focus} ${base}`
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
  small,
  ...props
}) {
  const classes = `${className} ${getClassname({
    hasIcon,
    outline,
    color,
    background,
    border,
    disabled,
    small
  })}`
  return (
    <button disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  )
}
