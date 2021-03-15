import AsyncSelect from 'react-select/async'

export default function Autocomplete({
  className = '',
  id,
  placeholder,
  fetcher,
  value,
  onChange = () => {},
  noDataMessage = 'Ningún juego para esta búsqueda'
}) {
  async function loadOptions(q) {
    const query = `autocomplete?q=${encodeURIComponent(q)}&rpp=5`
    const data = await fetcher(query)
    return data?.rows || []
  }

  return (
    <AsyncSelect
      inputId={id}
      placeholder={placeholder}
      closeMenuOnSelect
      cacheOptions
      defaultOptions
      isClearable
      loadOptions={loadOptions}
      className={`react-select ${className}`}
      value={value}
      onChange={onChange}
      getOptionLabel={opt => opt.name}
      getOptionValue={opt => opt.id}
      loadingMessage={() => 'Cargando...'}
      noOptionsMessage={() => noDataMessage}
    />
  )
}
