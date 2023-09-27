import { describe, expect, it } from 'bun:test'
import { URLOriginError } from './common'
import { origin, Origin } from './origin'
import { PathPattern } from './pathPattern'

describe('origin', () => {
  it('should be able to create an origin', () => {
    const exampleOrigin = origin('https://example.com')

    expect(exampleOrigin).toBeInstanceOf(Origin)
    expect(exampleOrigin.origin).toBe('https://example.com')
    expect(exampleOrigin.host).toBe('example.com')
    expect(exampleOrigin.hostname).toBe('example.com')
    expect(exampleOrigin.port).toBe(undefined)
    expect(exampleOrigin.protocol).toBe('https:')
    expect(exampleOrigin.pureProtocol).toBe('https')
  })

  it('should throw an error if the origin is invalid', () => {
    expect(() => origin('invalid origin')).toThrow(new URLOriginError('invalid origin'))
  })

  it('should be able to create a path pattern', () => {
    const exampleOrigin = origin('https://example.com')
    const examplePathPattern = exampleOrigin.pathPattern('/example/[param]', {
      param: 'param',
    })

    expect(examplePathPattern).toBeInstanceOf(PathPattern)
    expect(examplePathPattern.pathPattern).toBe('/example/[param]')
    expect(examplePathPattern.params).toEqual({ param: 'param' })
  })

  it('should be able to create search string', () => {
    const exampleOrigin = origin('https://example.com')

    expect(
      exampleOrigin.searchStringify({
        search: 'string',
      }),
    ).toBe('?search=string')
    expect(exampleOrigin.searchStringify(null)).toBe('')
  })
})
