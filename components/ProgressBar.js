import Router from 'next/router'
import NProgress from 'nprogress'

let loading = false
let timer

const MIN_TIME_TO_SHOW = 200

function start() {
  if (loading) {
    return
  }

  loading = true
  timer = setTimeout(() => {
    NProgress.start()
  }, MIN_TIME_TO_SHOW)
}

function stop() {
  loading = false
  clearTimeout(timer)
  NProgress.done()
}

Router.events.on('routeChangeStart', start)
Router.events.on('routeChangeComplete', stop)
Router.events.on('routeChangeError', stop)

export default function ProgressBar() {
  return null
}
