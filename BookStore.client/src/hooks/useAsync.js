import { useCallback, useEffect, useState } from 'react'

export function useAsync(asyncFn) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [attempts, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    asyncFn()
      .then((data) => {
        if (!ignore) setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (!ignore) setState({ status: 'error', data: null, error })
      })
    return () => {
      ignore = true
    }
  }, [asyncFn, attempts])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])

  return { ...state, retry }
}
