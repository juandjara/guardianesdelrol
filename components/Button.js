export function getClassname ({ hasIcon, outline }) {
  const hoverClasses = 'hover:opacity-75'
  const focusClasses = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  const colorClass = outline ? 'text-white bg-red-900 bg-opacity-50' : 'text-red-900 bg-white'
  const iconSideClass = hasIcon === 'right' ? 'pr-3' : 'pl-3'
  const contentClass = hasIcon ? `flex justify-center items-center space-x-2 ${iconSideClass}` : ''
  const baseClass = 'px-4 py-2 m-2 text-md font-semibold rounded-md border-2 border-current'
  return `${colorClass} ${baseClass} ${contentClass} ${hoverClasses} ${focusClasses}`
}

export default function Button ({ hasIcon, outline, className, children, ...props }) {
  const classes = `${getClassname({ hasIcon, outline })} ${className}`
  return (
    <button className={classes} {...props}>{children}</button>
  )
}