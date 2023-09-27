import type { Test, ExpectType } from '@esfx/type-model/test'
import type {
  ValidateSingleParamPathPatternSegment,
  PickSingleParamPathPatternParamNameSegment,
  ValidateSingleParamPathPatternSegments,
} from './SingleParam'

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  // Type check tests for ValidateSingleParamPathPatternSegment
  Test<ExpectType<ValidateSingleParamPathPatternSegment<'[param]'>, '[param]'>>,
  Test<ExpectType<ValidateSingleParamPathPatternSegment<'[...param]'>, never>>,
  Test<ExpectType<ValidateSingleParamPathPatternSegment<'[[...param]]'>, never>>,
  // Type check tests for PickSingleParamPathPatternParamNameSegment
  Test<ExpectType<PickSingleParamPathPatternParamNameSegment<'[param]'>, 'param'>>,
  Test<ExpectType<PickSingleParamPathPatternParamNameSegment<'[[...param]]'>, never>>,
  // Type check tests for ValidateSingleParamPathPatternSegments
  Test<ExpectType<ValidateSingleParamPathPatternSegments<'[param]'>, '[param]'>>,
  Test<ExpectType<ValidateSingleParamPathPatternSegments<'[[...param]]'>, never>>,
  Test<ExpectType<ValidateSingleParamPathPatternSegments<'[...param]/[[...param2]]'>, never>>,
  Test<ExpectType<ValidateSingleParamPathPatternSegments<'[...param]/[...param2]'>, never>>,
  Test<ExpectType<ValidateSingleParamPathPatternSegments<'[[...param]]/[param2]'>, never>>,
  Test<ExpectType<ValidateSingleParamPathPatternSegments<'[...param]/param2'>, never>>,
]
/// //////////////////////////////////////////////////////////////////////////////////
