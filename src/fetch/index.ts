import PathPattern from '../parser/PathPattern'
import TypeSafeResponse from '../responce'
import type { Jsonifiable } from 'type-fest'
import type { ValidPathPattern, ValidatePathPattern, GetParamsFromPathPattern } from '../parser/PathPattern'

type AnyStringCase<M extends string> = Lowercase<M> | Uppercase<M>

export type RequestMethods =
  | AnyStringCase<'DELETE'>
  | AnyStringCase<'GET'>
  | AnyStringCase<'HEAD'>
  | AnyStringCase<'OPTIONS'>
  | AnyStringCase<'PATCH'>
  | AnyStringCase<'POST'>
  | AnyStringCase<'PUT'>

type SafeBodyInit = Exclude<BodyInit, string> | Jsonifiable

type SafeRequestInitInternal = Omit<RequestInit, 'body' | 'method'> & {
  body?: SafeBodyInit
  method: RequestMethods
}

export type SafeRequestInit<P extends string> = ValidatePathPattern<P> extends never
  ? never
  : GetParamsFromPathPattern<P> extends null
  ? SafeRequestInitInternal & {
      params?: never
    }
  : SafeRequestInitInternal & {
      params: GetParamsFromPathPattern<P>
    }

export const isJSONBody = (body: SafeBodyInit | undefined): body is Jsonifiable =>
  body !== undefined &&
  !(body instanceof ReadableStream) &&
  !(body instanceof Blob) &&
  !(body instanceof ArrayBuffer) &&
  !ArrayBuffer.isView(body) &&
  !(body instanceof FormData) &&
  !(body instanceof URLSearchParams)

const safetch = <P extends string>(
  pathPattern: ValidPathPattern<P>,
  requestInit: SafeRequestInit<P>,
): Promise<TypeSafeResponse> => {
  const { params, body, ...rest } = requestInit

  const path = new PathPattern(pathPattern).createPath(params!)

  const parsedBody = isJSONBody(body) ? JSON.stringify(body) : body

  return fetch(path, {
    ...rest,
    body: parsedBody,
  }).then(response => new TypeSafeResponse(response))
}

export default safetch
