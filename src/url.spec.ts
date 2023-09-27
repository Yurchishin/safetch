import { describe, expect, it } from 'bun:test'
import { origin, Origin } from './origin'
import { PathPattern } from './pathPattern'
import { SafeURL } from './url'

describe('url', () => {
  it('should be able to create an url', () => {
    const url = origin('http://localhost:3000').pathPattern('/', null).url()

    expect(url).toBeInstanceOf(SafeURL)
    expect(url.origin).toBeInstanceOf(Origin)
    expect(url.pathPattern).toBeInstanceOf(PathPattern)
    expect(url._search).toBeNull()
    expect(url._hash).toBeUndefined()
  })

  it('should be able to immutable change search', () => {
    const url = origin('http://localhost:3000').pathPattern('/', null).url()

    expect(url._search).toBeNull()
    expect(url._hash).toBeUndefined()

    const newURL = url.search({ a: 1 })

    expect(newURL).toBeInstanceOf(SafeURL)
    expect(newURL.origin).toBeInstanceOf(Origin)
    expect(newURL.pathPattern).toBeInstanceOf(PathPattern)
    expect(newURL._search).toEqual({ a: 1 })
    expect(newURL._hash).toBeUndefined()

    expect(url._search).toBeNull()
    expect(url._hash).toBeUndefined()
  })

  it('should be able to immutable change hash', () => {
    const url = origin('http://localhost:3000').pathPattern('/', null).url()

    expect(url._hash).toBeUndefined()
    expect(url._search).toBeNull()

    const newURL = url.hash('#test')

    expect(newURL).toBeInstanceOf(SafeURL)
    expect(newURL.origin).toBeInstanceOf(Origin)
    expect(newURL.pathPattern).toBeInstanceOf(PathPattern)
    expect(newURL._search).toBeNull()
    expect(newURL._hash).toBe('#test')

    expect(url._hash).toBeUndefined()
    expect(url._search).toBeNull()
  })

  it('should be able to convert to string', () => {
    expect(origin('http://localhost:3000').pathPattern('/', null).url().toString()).toBe('http://localhost:3000/')
    expect(origin('http://localhost:3000').pathPattern('/', null).url().search({ a: 1 }).toString()).toBe(
      'http://localhost:3000/?a=1',
    )
    expect(origin('http://localhost:3000').pathPattern('/', null).url().hash('#test').toString()).toBe(
      'http://localhost:3000/#test',
    )
    expect(origin('http://localhost:3000').pathPattern('/', null).url().search({ a: 1 }).hash('#test').toString()).toBe(
      'http://localhost:3000/?a=1#test',
    )

    expect(
      origin('http://localhost:3000')
        .pathPattern('/foo/[bar]/baz/[...rest]', {
          bar: 'test1',
          rest: ['test2', 'test3'],
        })
        .url()
        .toString(),
    ).toBe('http://localhost:3000/foo/test1/baz/test2/test3')
    expect(
      origin('http://localhost:3000')
        .pathPattern('/foo/[bar]/baz/[...rest]', {
          bar: 'test1',
          rest: ['test2', 'test3'],
        })
        .url()
        .search({ a: 1 })
        .toString(),
    ).toBe('http://localhost:3000/foo/test1/baz/test2/test3?a=1')
    expect(
      origin('http://localhost:3000')
        .pathPattern('/foo/[bar]/baz/[...rest]', {
          bar: 'test1',
          rest: ['test2', 'test3'],
        })
        .url()
        .hash('#test')
        .toString(),
    ).toBe('http://localhost:3000/foo/test1/baz/test2/test3#test')
    expect(
      origin('http://localhost:3000')
        .pathPattern('/foo/[bar]/baz/[...rest]', {
          bar: 'test1',
          rest: ['test2', 'test3'],
        })
        .url()
        .search({ a: 1 })
        .hash('#test')
        .toString(),
    ).toBe('http://localhost:3000/foo/test1/baz/test2/test3?a=1#test')
  })

  it('should be able to convert to native URL', () => {
    expect(origin('http://localhost:3000').pathPattern('/', null).url().toNativeURL()).toBeInstanceOf(URL)
  })
})
