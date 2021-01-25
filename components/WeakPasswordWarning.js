export default function WeakPasswordWarning({ margin = 'mt-1 mr-2' }) {
  return (
    <p className={`text-red-700 text-xs ${margin}`}>
      Es necesario usar una contraseña de fuerza 3 o más. Visita{' '}
      <a
        className="text-blue-500"
        href="https://www.xataka.com/basics/como-crear-contrasena-segura-como-gestionar-despues-para-proteger-tus-cuentas"
        target="_blank"
        rel="noopener noreferrer">
        este art&iacute;culo
      </a>{' '}
      para saber más.
    </p>
  )
}
