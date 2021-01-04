export default function Spinner({ size = '6', color = 'white' }) {
  return (
    <div
      style={{ borderRightColor: 'transparent' }}
      className={`w-${size} h-${size} border-2 border-${color} rounded-full loader-rotate`}></div>
  )
}
