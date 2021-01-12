export default function Label({ name, margin = 'mb-1', text, className, ...props }) {
  return (
    <label
      className={`${margin} text-sm text-gray-700 font-medium block ${className}`}
      htmlFor={name}
      {...props}>
      {text}
    </label>
  )
}
