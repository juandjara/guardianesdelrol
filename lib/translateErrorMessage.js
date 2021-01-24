export default function translateErrorMessage(msg) {
  if (msg.indexOf('Invalid token') !== -1 || msg.indexOf('token is expired') !== -1) {
    return 'Tu sesión ha caducado. Prueba otra vez tras volver a iniciar sesión'
  }
  if (msg === 'User not found') {
    return 'Este email no está registrado'
  }
  if (msg === 'No user found with that email, or password invalid.') {
    return 'Este email no está registrado, o la contraseña es inválida'
  }
  if (msg === 'A user with this email address has already been registered') {
    return 'Ya existe un usuario registrado con este email'
  }
  return msg
}
