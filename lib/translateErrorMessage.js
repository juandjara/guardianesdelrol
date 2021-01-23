export default function translateErrorMessage(msg) {
  if (msg.indexOf('token is expired') !== -1) {
    return 'Tu enlace ha caducado. Prueba a pedir uno nuevo desde la pantalla de inicio de sesión'
  }
  if (msg === 'No user found with that email, or password invalid.') {
    return 'No hay ningun usuario para ese email, o la contraseña es incorrecta'
  }
  if (msg === 'A user with this email address has already been registered') {
    return 'Ya existe un usuario registrado con este email'
  }
  return msg
}
