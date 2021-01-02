export function getClassname ({ hasIcon, outline, color, background, border }) {
  const _color = color || (outline ? 'text-white' : 'text-red-900')
  const _background = background || (outline ? 'bg-red-900 bg-opacity-50' : 'bg-white')
  const _border = border || 'border-current'
  const layout = hasIcon ? `flex justify-center items-center space-x-2 ${hasIcon === 'right' ? 'pr-3' : 'pl-3'}` : ''
  const base = 'px-4 py-2 m-2 text-md font-semibold rounded-md border-2'
  const hover = 'hover:opacity-75'
  const focus = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-transparent'
  return `${_color} ${_background} ${_border} ${base} ${layout} ${hover} ${focus}`
}

export default function Button ({ className = '', children, hasIcon, outline, color, background, border, ...props }) {
  const classes = `${getClassname({ hasIcon, outline, color, background, border })} ${className}`
  return (
    <button className={classes} {...props}>{children}</button>
  )
}