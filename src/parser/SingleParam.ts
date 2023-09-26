import zod from 'zod'
import {
  pathPatternSegmentValidCharactersRegex,
  ValidatePathPatternError,
  ValidatePathError,
  ParamPathPatternSegment,
} from './common'
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

export const pathPatternSingleParamSegmentRegex = /^\[(?<param>[\dA-Za-z]+)]$/

class SingleParamPathPatternSegment extends ParamPathPatternSegment<ValidSingleParamPathPatternSegment, string> {
  static is(segment: string): segment is ValidSingleParamPathPatternSegment {
    return pathPatternSingleParamSegmentRegex.test(segment)
  }

  override paramName: string
  override paramSchema: Record<string, zod.ZodString>
  override regExp: RegExp

  constructor(segment: ValidSingleParamPathPatternSegment) {
    super(segment)

    const match = pathPatternSingleParamSegmentRegex.exec(segment)

    if (!match) throw new ValidatePathPatternError(`Invalid path pattern segment "${segment}"`)

    const { param } = match.groups!

    this.paramName = param

    this.paramSchema = { [param]: zod.string() }

    // eslint-disable-next-line security/detect-non-literal-regexp
    this.regExp = new RegExp(`^\\[(?<param>(${this.paramName}))]$`)
  }

  override matchPathPattern(segment: string): boolean {
    return this.regExp.test(segment)
  }

  override validatePathPatternSegments(restPathPatternSegments: readonly string[]): void {
    if (!this.matchPathPattern(restPathPatternSegments[0]))
      throw new ValidatePathPatternError(`Invalid symbols in segment "${this.segment}" at path pattern`)
  }

  override pickPathSegments(pathSegments: readonly string[]): string[] {
    return pathSegments[0] ? [`${pathSegments[0]}`] : []
  }

  override matchPathSegments(pathSegments: readonly string[]): boolean {
    const ownPathSegments = this.pickPathSegments(pathSegments)

    return (
      ownPathSegments.length > 0 &&
      ownPathSegments.every(ownPathSegment => pathPatternSegmentValidCharactersRegex.test(ownPathSegment))
    )
  }

  override validatePathSegments(pathSegments: readonly string[]): void {
    const ownPathSegments = this.pickPathSegments(pathSegments)

    if (ownPathSegments.length === 0) throw new ValidatePathError(`Single segment must have at least one path segment`)

    ownPathSegments.forEach(pathSegment => {
      if (!pathPatternSegmentValidCharactersRegex.test(pathSegment)) {
        throw new ValidatePathError(`Invalid symbols in segment "${pathSegment}" at path`)
      }
    })
  }

  override createPathSegment(params: Readonly<Record<string, string | readonly string[]>>): string {
    const paramValue = params[this.paramName] as string

    return `${paramValue}`
  }
}

export default SingleParamPathPatternSegment
