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
