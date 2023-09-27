import type { ValidCatchAllPathPatternSegment } from './CatchAll'
import type { ValidOptionalCatchAllPathPatternSegment } from './OptionalCatchAll'

export type ValidSingleParamPathPatternSegment = `[${string}]`

export type ValidateSingleParamPathPatternSegment<P extends string> = P extends ValidOptionalCatchAllPathPatternSegment
  ? never
  : P extends ValidCatchAllPathPatternSegment
  ? never
  : P extends ValidSingleParamPathPatternSegment
  ? P
  : never

export type PickSingleParamPathPatternParamNameSegment<P extends string> =
  ValidateSingleParamPathPatternSegment<P> extends never
    ? never
    : ValidateSingleParamPathPatternSegment<P> extends `[${infer Param}]`
    ? Param
    : never

export type ValidateSingleParamPathPatternSegments<P extends string> = P extends `${infer Head}/${string}`
  ? ValidateSingleParamPathPatternSegment<Head> extends never
    ? never
    : P
  : P extends ValidateSingleParamPathPatternSegment<P>
  ? P
  : never
