import type { Test, ExpectType } from '@esfx/type-model/test'
import type { ValidateStringPathPatternSegment, ValidateStringPathPatternSegments } from './String'

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  // Type check tests for ValidateStringPathPatternSegment
  Test<ExpectType<ValidateStringPathPatternSegment<'[param]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegment<'[...param]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegment<'[[...param]]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegment<'param'>, 'param'>>,
  // Type check tests for ValidateStringPathPatternSegments
  Test<ExpectType<ValidateStringPathPatternSegments<'param'>, 'param'>>,
  Test<ExpectType<ValidateStringPathPatternSegments<'[param]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegments<'[[...param]]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegments<'[...param]/[[...param2]]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegments<'[...param]/[...param2]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegments<'[[...param]]/[param2]'>, never>>,
  Test<ExpectType<ValidateStringPathPatternSegments<'[...param]/param2'>, never>>,
]
/// //////////////////////////////////////////////////////////////////////////////////
