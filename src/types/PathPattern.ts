import type {
  ValidOptionalCatchAllPathPatternSegment,
  ValidateOptionalCatchAllPathPatternSegments,
  PickOptionalCatchAllPathPatternParamNameSegment,
} from './OptionalCatchAll'
import type {
  ValidCatchAllPathPatternSegment,
  ValidateCatchAllPathPatternSegments,
  PickCatchAllPathPatternParamNameSegment,
} from './CatchAll'
import type {
  ValidSingleParamPathPatternSegment,
  ValidateSingleParamPathPatternSegments,
  PickSingleParamPathPatternParamNameSegment,
} from './SingleParam'
import type { ValidStringPathPatternSegment, ValidateStringPathPatternSegments } from './String'

export type ValidatePathPattern<Pattern extends string> = Pattern extends '/'
  ? Pattern
  : Pattern extends `/${string}/`
  ? never
  : Pattern extends `/${infer Segment}/${infer Rest}`
  ? Segment extends ''
    ? never
    : Segment extends ValidOptionalCatchAllPathPatternSegment
    ? ValidateOptionalCatchAllPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : Pattern
    : Segment extends ValidCatchAllPathPatternSegment
    ? ValidateCatchAllPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : Pattern
    : Segment extends ValidSingleParamPathPatternSegment
    ? ValidateSingleParamPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : `/${Segment}${ValidatePathPattern<`/${Rest}`>}`
    : Segment extends ValidStringPathPatternSegment
    ? ValidateStringPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : `/${Segment}${ValidatePathPattern<`/${Rest}`>}`
    : never
  : Pattern extends `/${infer Segment}`
  ? Segment extends ''
    ? never
    : Segment extends ValidOptionalCatchAllPathPatternSegment
    ? ValidateOptionalCatchAllPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : Segment extends ValidCatchAllPathPatternSegment
    ? ValidateCatchAllPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : Segment extends ValidSingleParamPathPatternSegment
    ? ValidateSingleParamPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : Segment extends ValidStringPathPatternSegment
    ? ValidateStringPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : never
  : never

export type ValidPathPattern<Pattern extends string> = ValidatePathPattern<Pattern> extends never ? never : Pattern

export type GetParamsFromPathPattern<P extends string> = ValidatePathPattern<P> extends never
  ? never
  : P extends `/${infer Segment}/${infer Rest}`
  ? Segment extends ValidSingleParamPathPatternSegment
    ? GetParamsFromPathPattern<`/${Rest}`> extends null
      ? Record<PickSingleParamPathPatternParamNameSegment<Segment>, string>
      : GetParamsFromPathPattern<`/${Rest}`> & Record<PickSingleParamPathPatternParamNameSegment<Segment>, string>
    : GetParamsFromPathPattern<`/${Rest}`>
  : P extends `/${infer Segment}`
  ? Segment extends ValidOptionalCatchAllPathPatternSegment
    ? Record<PickOptionalCatchAllPathPatternParamNameSegment<Segment>, string[]>
    : Segment extends ValidCatchAllPathPatternSegment
    ? Record<PickCatchAllPathPatternParamNameSegment<Segment>, [string, ...string[]]>
    : Segment extends ValidSingleParamPathPatternSegment
    ? Record<PickSingleParamPathPatternParamNameSegment<Segment>, string>
    : null
  : Record<string, string | string[]>
