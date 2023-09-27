import { describe, expect, it } from 'bun:test'
import TypeSafeResponse from './responce'

describe('origin', () => {
  it('should create instance', () => {
    const nativeResponse = new Response('test', {
      headers: {
        'Content-Type': 'text/plain',
      },
      status: 200,
      statusText: 'OK',
    })

    const responce = new TypeSafeResponse(nativeResponse)

    expect(responce.headers.get('Content-Type')).toBe(nativeResponse.headers.get('Content-Type'))
    expect(responce.status).toBe(nativeResponse.status)
    expect(responce.statusText).toBe(nativeResponse.statusText)
  })

  it('should parse json', () => {
    const nativeResponse = new Response('{ "foo": 1 }')

    const responce = new TypeSafeResponse(nativeResponse)

    return expect(responce.json()).resolves.toEqual({ foo: 1 })
  })
})
