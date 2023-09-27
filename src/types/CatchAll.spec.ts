import type { Test, ExpectType } from '@esfx/type-model/test'
import type {
  ValidateCatchAllPathPatternSegment,
  PickCatchAllPathPatternParamNameSegment,
  ValidateCatchAllPathPatternSegments,
} from './CatchAll'

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  // Type check tests for ValidateCatchAllPathPatternSegment
  Test<ExpectType<ValidateCatchAllPathPatternSegment<'[...param]'>, '[...param]'>>,
  Test<ExpectType<ValidateCatchAllPathPatternSegment<'[[...param]]'>, never>>,
  // Type check tests for PickCatchAllPathPatternParamNameSegment
  Test<ExpectType<PickCatchAllPathPatternParamNameSegment<'[...param]'>, 'param'>>,
  Test<ExpectType<PickCatchAllPathPatternParamNameSegment<'[[...param]]'>, never>>,
  // Type check tests for ValidateCatchAllPathPatternSegments
  Test<ExpectType<ValidateCatchAllPathPatternSegments<'[...param]'>, '[...param]'>>,
  Test<ExpectType<ValidateCatchAllPathPatternSegments<'[[...param]]'>, never>>,
  Test<ExpectType<ValidateCatchAllPathPatternSegments<'[...param]/[[...param2]]'>, never>>,
  Test<ExpectType<ValidateCatchAllPathPatternSegments<'[...param]/[...param2]'>, never>>,
  Test<ExpectType<ValidateCatchAllPathPatternSegments<'[[...param]]/[param2]'>, never>>,
  Test<ExpectType<ValidateCatchAllPathPatternSegments<'[...param]/param2'>, never>>,
]
/// //////////////////////////////////////////////////////////////////////////////////
