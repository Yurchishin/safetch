import TypeSafeResponse from './responce'
import type { SafeURL } from './url'

type AnyStringCase<M extends string> = Lowercase<M> | Uppercase<M>

export type RequestMethods =
  | AnyStringCase<'DELETE'>
  | AnyStringCase<'GET'>
  | AnyStringCase<'HEAD'>
  | AnyStringCase<'OPTIONS'>
  | AnyStringCase<'PATCH'>
  | AnyStringCase<'POST'>
  | AnyStringCase<'PUT'>

export type SafeRequestInit = Omit<RequestInit, 'method'> & {
  method: RequestMethods
}

const safetch = <P extends string>(url: SafeURL<P>, requestInit?: SafeRequestInit): Promise<TypeSafeResponse> => {
  const urlInstance = url.toNativeURL()

  return fetch(urlInstance, requestInit).then(response => new TypeSafeResponse(response))
}

export default safetch
