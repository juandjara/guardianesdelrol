import Head from 'next/head'

export default function Title({ title }) {
  const base = 'Guardianes del Rol'
  return (
    <Head>
      <title>{title ? `${title} - ${base}` : base}</title>
    </Head>
  )
}
