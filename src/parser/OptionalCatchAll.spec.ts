import { describe, it, expect } from 'bun:test'
import z from 'zod'
import { ValidatePathPatternError, ValidatePathError } from './common'
import OptionalCatchAll from './OptionalCatchAll'
import type { Test, ExpectType } from '@esfx/type-model/test'
import type {
  ValidateOptionalCatchAllPathPatternSegment,
  PickOptionalCatchAllPathPatternParamNameSegment,
  ValidateOptionalCatchAllPathPatternSegments,
} from './OptionalCatchAll'

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  // Type check tests for ValidateOptionalCatchAllPathPatternSegment
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegment<'[[...param]]'>, '[[...param]]'>>,
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegment<'[...param]'>, never>>,
  // Type check tests for PickOptionalCatchAllPathPatternParamNameSegment
  Test<ExpectType<PickOptionalCatchAllPathPatternParamNameSegment<'[[...param]]'>, 'param'>>,
  Test<ExpectType<PickOptionalCatchAllPathPatternParamNameSegment<'[...param]'>, never>>,
  // Type check tests for ValidateOptionalCatchAllPathPatternSegments
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegments<'[[...param]]'>, '[[...param]]'>>,
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegments<'[...param]'>, never>>,
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegments<'[[...param]]/[[...param2]]'>, never>>,
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegments<'[[...param]]/[...param2]'>, never>>,
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegments<'[[...param]]/[param2]'>, never>>,
  Test<ExpectType<ValidateOptionalCatchAllPathPatternSegments<'[[...param]]/param2'>, never>>,
]
/// //////////////////////////////////////////////////////////////////////////////////

describe('OptionalCatchAll', () => {
  it('should succeed creating instance with a valid path pattern segment', () => {
    const segment = new OptionalCatchAll('[[...testParam]]')

    expect(segment.segment).toBe('[[...testParam]]')
    expect(segment.paramName).toBe('testParam')
    expect(segment.paramSchema).toEqual({ testParam: expect.any(z.ZodDefault) })
    expect(segment.regExp).toEqual(/^\[\[\.\.\.(?<param>(testParam))]]$/)
  })

  it('should throw an error creating instance with an invalid path pattern segment', () => {
    // @ts-expect-error: TS2345 because testParam is not a valid path pattern segment
    expect(() => new OptionalCatchAll('[[...testParam]]/test' as unknown)).toThrow(
      new ValidatePathPatternError('Invalid path pattern segment "[[...testParam]]/test"'),
    )
  })

  it('should correctly identify valid path pattern segment', () => {
    expect(OptionalCatchAll.is('testParam')).toBe(false)
    expect(OptionalCatchAll.is('[testParam]')).toBe(false)
    expect(OptionalCatchAll.is('[...testParam]')).toBe(false)
    expect(OptionalCatchAll.is('[[...testParam]]')).toBe(true)
  })

  it('should correctly match valid path pattern segment', () => {
    const segment = new OptionalCatchAll('[[...testParam]]')

    expect(segment.matchPathPattern('[...testParam2]')).toBe(false)
    expect(segment.matchPathPattern('[[...testParam]]')).toBe(true)
  })

  it('should correctly validate valid path pattern segments', () => {
    const segment = new OptionalCatchAll('[[...testParam]]')

    expect(() => segment.validatePathPatternSegments(['[[...testParam]]'])).not.toThrow()
    expect(() => segment.validatePathPatternSegments(['[[...testParam2]]'])).toThrow(
      new ValidatePathPatternError('Invalid symbols in segment "[[...testParam]]"'),
    )
    expect(() => segment.validatePathPatternSegments(['[[...testParam]]', '[[...testParam2]'])).toThrow(
      new ValidatePathPatternError(
        'Optional catch all segment must be last segment in path pattern "[[...testParam]]"',
      ),
    )
  })

  it('should correctly pick path segments', () => {
    const segment = new OptionalCatchAll('[[...testParam]]')

    expect(segment.pickPathSegments(['test', 'test2'])).toEqual(['test', 'test2'])
  })

  it('should correctly match path segments', () => {
    const segment = new OptionalCatchAll('[[...testParam]]')

    expect(segment.matchPathSegments(['#'])).toBe(false)
    expect(segment.matchPathSegments(['test', 'test2'])).toBe(true)
    expect(segment.matchPathSegments(['test'])).toBe(true)
    expect(segment.matchPathSegments(['test2'])).toBe(true)
    expect(segment.matchPathSegments([])).toBe(true)
  })

  it('should correctly validate path segments', () => {
    const segment = new OptionalCatchAll('[[...testParam]]')

    expect(() => segment.validatePathSegments(['test', 'test2'])).not.toThrow()
    expect(() => segment.validatePathSegments(['test'])).not.toThrow()
    expect(() => segment.validatePathSegments(['test2'])).not.toThrow()
    expect(() => segment.validatePathSegments(['#'])).toThrow(
      new ValidatePathError('Invalid symbols in segment "#" at path'),
    )
  })

  it('should correctly create path segment', () => {
    const segment = new OptionalCatchAll('[[...testParam]]')

    expect(segment.createPathSegment({ testParam: ['test', 'test2'] })).toBe('test/test2')
  })
})
