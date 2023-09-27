import type { ValidCatchAllPathPatternSegment } from './CatchAll'
import type { ValidOptionalCatchAllPathPatternSegment } from './OptionalCatchAll'
import type { ValidSingleParamPathPatternSegment } from './SingleParam'

export type ValidStringPathPatternSegment = string

export type ValidateStringPathPatternSegment<P extends string> = P extends ValidOptionalCatchAllPathPatternSegment
  ? never
  : P extends ValidCatchAllPathPatternSegment
  ? never
  : P extends ValidSingleParamPathPatternSegment
  ? never
  : P

export type ValidateStringPathPatternSegments<P extends string> = P extends `${infer Head}/${string}`
  ? ValidateStringPathPatternSegment<Head> extends never
    ? never
    : P
  : P extends ValidateStringPathPatternSegment<P>
  ? P
  : never
