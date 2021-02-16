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

export const buttonFocusStyle =
  'focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent'

export function getClassname({ small, hasIcon, color, background, border, disabled }) {
  const _color = color || 'text-red-900'
  const _background = background || 'bg-white hover:bg-red-50'
  const _border = border || 'border-white border-2'
  const _layout = hasIcon ? `flex justify-center items-center space-x-2` : 'block'
  const _padding = getPadding({ hasIcon, small })
  const _font = small ? 'text-sm font-medium' : 'text-base font-semibold'
  const _disabled = disabled ? 'opacity-50 pointer-events-none' : ''
  const base = 'transition-colors rounded-md'

  return `${_color} ${_background} ${_padding} ${_border} ${_disabled} ${_font} ${_layout} ${buttonFocusStyle} ${base}`
}

export default function Button({
  className = '',
  children,
  hasIcon,
  color,
  background,
  border,
  disabled,
  small,
  ...props
}) {
  const classes = `${className} ${getClassname({
    hasIcon,
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
