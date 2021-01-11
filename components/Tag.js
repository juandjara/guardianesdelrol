export default function Tag({ children, color = 'text-blue-900', background = 'bg-blue-100' }) {
  return (
    <span
      className={`uppercase inline-block text-xs px-2 tracking-wide leading-5 rounded-md ${color} ${background}`}>
      {children}
    </span>
  )
}
