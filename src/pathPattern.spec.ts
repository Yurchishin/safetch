import { describe, expect, it } from 'bun:test'
import { URLPathPatternError } from './common'
import { origin, Origin } from './origin'
import { PathPattern } from './pathPattern'
import { SafeURL } from './url'

describe('pathPattern', () => {
  it('should be able to create an path pattern', () => {
    const pathPattern = origin('http://localhost:3000').pathPattern('/', null)

    expect(pathPattern).toBeInstanceOf(PathPattern)
    expect(pathPattern.origin).toBeInstanceOf(Origin)
    expect(pathPattern.origin.origin).toBe('http://localhost:3000')
    expect(pathPattern.pathPattern).toBe('/')
    expect(pathPattern.params).toBe(null)
  })

  it('should be able to normalize path pattern', () => {
    const testOrigin = origin('http://localhost:3000')

    expect(testOrigin.pathPattern('/', null).pathPattern).toBe('/')
    expect(testOrigin.pathPattern('/ ', null).pathPattern).toBe('/')
    // @ts-expect-error: TS2345 because passing wrong path pattern for testing
    expect(testOrigin.pathPattern(' /', null).pathPattern).toBe('/')
    // @ts-expect-error: TS2345 because passing wrong path pattern for testing
    expect(testOrigin.pathPattern(' / ', null).pathPattern).toBe('/')
    // @ts-expect-error: TS2345 because passing wrong path pattern for testing
    expect(testOrigin.pathPattern('foo', null).pathPattern).toBe('/foo')
    // @ts-expect-error: TS2345 because passing wrong path pattern for testing
    expect(testOrigin.pathPattern('/foo/', null).pathPattern).toBe('/foo')
    // @ts-expect-error: TS2345 because passing wrong path pattern for testing
    expect(testOrigin.pathPattern('foo/', null).pathPattern).toBe('/foo')
    // @ts-expect-error: TS2345 because passing wrong path pattern for testing
    expect(testOrigin.pathPattern('///foo////bar///', null).pathPattern).toBe('/foo/bar')
  })

  it('should be able to validate path pattern', () => {
    const testOrigin = origin('http://localhost:3000')

    expect(
      // @ts-expect-error: TS2345 because passing wrong path pattern for testing
      () => testOrigin.pathPattern('/foo/[[...bar]]/baz', { bar: ['test'] }),
    ).toThrow(
      new URLPathPatternError(
        '/foo/[[...bar]]/baz',
        'OptionalCatchAll path pattern segment must be the last segment, but got "baz"',
      ),
    )

    expect(
      // @ts-expect-error: TS2345 because passing wrong path pattern for testing
      () => testOrigin.pathPattern('/foo/[...bar]/baz', { bar: ['test'] }),
    ).toThrow(
      new URLPathPatternError(
        '/foo/[...bar]/baz',
        'CatchAll path pattern segment must be the last segment, but got "baz"',
      ),
    )
  })

  it('should be able to create a safe URL', () => {
    const testOrigin = origin('http://localhost:3000')
    const pathPattern = testOrigin.pathPattern('/', null)

    const safeURL = pathPattern.url()

    expect(safeURL).toBeInstanceOf(SafeURL)
    expect(safeURL.origin).toBeInstanceOf(Origin)
    expect(safeURL.origin.origin).toBe('http://localhost:3000')
    expect(safeURL.pathPattern).toBeInstanceOf(PathPattern)
    expect(safeURL.pathPattern.pathPattern).toBe('/')
    expect(safeURL._search).toBe(null)
    expect(safeURL._hash).toBe(undefined)

    const safeURLWithSearch = pathPattern.url({ foo: 'bar' })

    expect(safeURLWithSearch).toBeInstanceOf(SafeURL)
    expect(safeURLWithSearch.origin).toBeInstanceOf(Origin)
    expect(safeURLWithSearch.origin.origin).toBe('http://localhost:3000')
    expect(safeURLWithSearch.pathPattern).toBeInstanceOf(PathPattern)
    expect(safeURLWithSearch.pathPattern.pathPattern).toBe('/')
    expect(safeURLWithSearch._search).toEqual({ foo: 'bar' })
    expect(safeURLWithSearch._hash).toBe(undefined)

    const safeURLWithHash = pathPattern.url(null, '#test')

    expect(safeURLWithHash).toBeInstanceOf(SafeURL)
    expect(safeURLWithHash.origin).toBeInstanceOf(Origin)
    expect(safeURLWithHash.origin.origin).toBe('http://localhost:3000')
    expect(safeURLWithHash.pathPattern).toBeInstanceOf(PathPattern)
    expect(safeURLWithHash.pathPattern.pathPattern).toBe('/')
    expect(safeURLWithHash._search).toBe(null)
    expect(safeURLWithHash._hash).toBe('#test')

    const safeURLWithSearchAndHash = pathPattern.url({ foo: 'bar' }, '#test')

    expect(safeURLWithSearchAndHash).toBeInstanceOf(SafeURL)
    expect(safeURLWithSearchAndHash.origin).toBeInstanceOf(Origin)
    expect(safeURLWithSearchAndHash.origin.origin).toBe('http://localhost:3000')
    expect(safeURLWithSearchAndHash.pathPattern).toBeInstanceOf(PathPattern)
    expect(safeURLWithSearchAndHash.pathPattern.pathPattern).toBe('/')
    expect(safeURLWithSearchAndHash._search).toEqual({ foo: 'bar' })
    expect(safeURLWithSearchAndHash._hash).toBe('#test')
  })

  it('should be able to create a pathname', () => {
    const exampleOrigin = origin('http://localhost:3000')

    expect(exampleOrigin.pathPattern('/', null).createPathname()).toBe('/')
    expect(exampleOrigin.pathPattern('/foo', null).createPathname()).toBe('/foo')
    expect(exampleOrigin.pathPattern('/foo/bar', null).createPathname()).toBe('/foo/bar')

    expect(exampleOrigin.pathPattern('/foo/[bar]', { bar: 'test' }).createPathname()).toBe('/foo/test')
    expect(exampleOrigin.pathPattern('/foo/[bar]/baz', { bar: 'test' }).createPathname()).toBe('/foo/test/baz')

    expect(exampleOrigin.pathPattern('/foo/[...bar]', { bar: ['test1', 'test2'] }).createPathname()).toBe(
      '/foo/test1/test2',
    )
    expect(
      exampleOrigin
        .pathPattern('/foo/[bar]/baz/[...qux]', {
          bar: 'test1',
          qux: ['test2', 'test3'],
        })
        .createPathname(),
    ).toBe('/foo/test1/baz/test2/test3')

    expect(exampleOrigin.pathPattern('/foo/[[...bar]]', { bar: ['test1', 'test2'] }).createPathname()).toBe(
      '/foo/test1/test2',
    )
    expect(exampleOrigin.pathPattern('/foo/[[...bar]]', { bar: [] }).createPathname()).toBe('/foo')
    expect(
      exampleOrigin
        .pathPattern('/foo/[bar]/baz/[[...qux]]', {
          bar: 'test1',
          qux: ['test2', 'test3'],
        })
        .createPathname(),
    ).toBe('/foo/test1/baz/test2/test3')
    expect(
      exampleOrigin
        .pathPattern('/foo/[bar]/baz/[[...qux]]', {
          bar: 'test1',
          qux: [],
        })
        .createPathname(),
    ).toBe('/foo/test1/baz')
  })
})
