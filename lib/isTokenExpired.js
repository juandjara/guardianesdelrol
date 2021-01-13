export default function isTokenExpired(token) {
  if (!token) {
    return true
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const time = payload.exp * 1000
    return time < Date.now()
  } catch (err) {
    console.error(err)
    return true
  }
}
