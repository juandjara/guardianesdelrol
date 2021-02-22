import { useMemo } from 'react'
import Button from './Button'
import Select from './Select'

export default function Pagination({ count, page, rpp, onChange }) {
  const lastPage = Math.floor(count / rpp)
  const selectedPage = useMemo(() => ({ label: page, value: page }), [page])
  const pageOptions = useMemo(
    () =>
      Array.from({ length: lastPage + 1 })
        .fill(0)
        .map((_, i) => ({ label: i, value: i })),
    [lastPage]
  )

  function handlePageSelect(opt) {
    onChange(opt.value)
  }

  function handleFirstPage() {
    onChange(0)
  }

  function handlePrevPage() {
    onChange(page - 1)
  }

  function handleNextPage() {
    onChange(page + 1)
  }

  function handleLastPage() {
    onChange(lastPage)
  }

  if (!count) {
    return null
  }

  return (
    <div className="ml-auto flex items-center justify-end mt-8">
      <Button
        small
        hasIcon="only"
        color="text-white"
        background="bg-red-500 hover:bg-red-700"
        border="border-none"
        className="m-2 ml-0"
        disabled={page === 0}
        onClick={handleFirstPage}>
        <svg
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </Button>
      <Button
        small
        hasIcon="only"
        color="text-white"
        background="bg-red-500 hover:bg-red-700"
        border="border-none"
        className="m-2 ml-0"
        disabled={page === 0}
        onClick={handlePrevPage}>
        <svg
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>
      <div className="flex items-center px-2 w-60 text-base tracking-wide font-semibold">
        <span>P&aacute;gina</span>
        <Select
          className="inline-flex mx-2 w-20"
          optionsClassname="absolute left-0 bottom-0 right-0 mb-12 h-40 overflow-y-auto"
          options={pageOptions}
          onChange={handlePageSelect}
          selected={selectedPage}
        />
        <span>de {lastPage}</span>
      </div>
      <Button
        small
        hasIcon="only"
        color="text-white"
        background="bg-red-500 hover:bg-red-700"
        border="border-none"
        className="m-2 mr-0"
        disabled={page === lastPage}
        onClick={handleNextPage}>
        <svg
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
      <Button
        small
        hasIcon="only"
        color="text-white"
        background="bg-red-500 hover:bg-red-700"
        border="border-none"
        className="m-2 mr-0"
        disabled={page === lastPage}
        onClick={handleLastPage}>
        <svg
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </Button>
    </div>
  )
}
