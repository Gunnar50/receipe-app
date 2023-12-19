export interface Result<T> {
  data: T | null
  error: Error | null
}

export interface StandardError {
  error: string
  message: string
}

export async function tryPromise<T>(func: Promise<T>): Promise<Result<T>>
{
  try {
    const data = await func
    return <Result<T>>{data, error: null}
  } catch (error) {
    const result = <Result<T>>{data: null, error}
    console.error(result.error?.message)

    return result
  }
}

export function trySync<T>(func: Function): Result<T>
{
  try {
    return <Result<any>>{data: func(), error: null}
  } catch (error) {
    const result = <Result<any>>{data: null, error}
    console.error(result.error?.message)

    return result
  }
}

export function formatError(err: Error): StandardError {
  return {
    error: err.name,
    message: err.message,
  }
}
