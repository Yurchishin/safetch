import { URLPathPatternError, canParseURL } from './common'
import { SafeURL } from './url'
import type { GetParamsFromPathPattern, ValidPathPattern } from './types/PathPattern'
import type { URLHash, URLSearchParamsInfo } from './url'
import type { Origin } from './origin'

const multiSlashes = /\/{2,}/g

const pathPatternOptionalCatchAllSegmentRegex = /^\[{2}\.{3}(?<param>.+)]{2}$/
const pathPatternCatchAllSegmentRegex = /^\[\.{3}(?<param>.+)]$/
const pathPatternSingleParamSegmentRegex = /^\[(?<param>.+)]$/

const isOptionalCatchAllPathPatternSegment = (segment: string): boolean =>
  pathPatternOptionalCatchAllSegmentRegex.test(segment)
const isCatchAllPathPatternSegment = (segment: string): boolean => pathPatternCatchAllSegmentRegex.test(segment)
const isSingleParamPathPatternSegment = (segment: string): boolean => {
  if (isOptionalCatchAllPathPatternSegment(segment)) return false
  if (isCatchAllPathPatternSegment(segment)) return false

  return pathPatternSingleParamSegmentRegex.test(segment)
}

const validatePathPattern = (pathPattern: string): void => {
  const segments = pathPattern.split('/').filter(segment => segment !== '')

  if (pathPattern === '/') return
  if (!canParseURL(`http://localhost${pathPattern}`)) throw new URLPathPatternError(pathPattern, 'Invalid path pattern')
  if (pathPattern.includes('#')) throw new URLPathPatternError(pathPattern, 'Path pattern must not contain hash ("#")')

  segments.forEach((segment, index) => {
    if (isOptionalCatchAllPathPatternSegment(segment)) {
      const nextSegment = segments[index + 1]

      if (nextSegment)
        throw new URLPathPatternError(
          pathPattern,
          `OptionalCatchAll path pattern segment must be the last segment, but got "${nextSegment}"`,
        )
    }

    if (isCatchAllPathPatternSegment(segment)) {
      const nextSegment = segments[index + 1]

      if (nextSegment)
        throw new URLPathPatternError(
          pathPattern,
          `CatchAll path pattern segment must be the last segment, but got "${nextSegment}"`,
        )
    }
  })
}

const normalizePathPattern = (pathPattern: string): string => {
  if (pathPattern === '/') return pathPattern

  // trim string
  if (pathPattern.trim() !== pathPattern) return normalizePathPattern(pathPattern.trim())
  // add leading slash
  if (!pathPattern.startsWith('/')) return normalizePathPattern(`/${pathPattern}`)
  // remove trailing slash
  if (pathPattern.endsWith('/')) return normalizePathPattern(pathPattern.slice(0, -1))
  // replace multiple slashes with a single slash
  if (multiSlashes.test(pathPattern)) return normalizePathPattern(pathPattern.replaceAll(multiSlashes, '/'))

  return pathPattern
}

export class PathPattern<P extends string> {
  readonly origin: Origin
  readonly pathPattern: ValidPathPattern<P>
  readonly params: GetParamsFromPathPattern<P>

  constructor(origin: Origin, pathPattern: ValidPathPattern<P>, params: GetParamsFromPathPattern<P>) {
    const normalizedPathPattern = normalizePathPattern(pathPattern) as ValidPathPattern<P>

    validatePathPattern(normalizedPathPattern)

    this.origin = origin
    this.pathPattern = normalizedPathPattern
    this.params = params
  }

  url(search: URLSearchParamsInfo | null = null, hash: URLHash | undefined = undefined): SafeURL<P> {
    return new SafeURL<P>({
      pathPattern: this,
      search,
      hash,
    })
  }

  createPathname(): string {
    if (this.pathPattern === '/') return '/'

    const segments = this.pathPattern.split('/').filter(segment => segment !== '')

    return segments.reduce((path, segment) => {
      if (isOptionalCatchAllPathPatternSegment(segment)) {
        const paramName = pathPatternOptionalCatchAllSegmentRegex.exec(segment)!.groups!.param

        const paramValue = this.params[paramName] as string[] | undefined

        return paramValue && paramValue.length > 0 ? `${path}/${paramValue.join('/')}` : path
      }

      if (isCatchAllPathPatternSegment(segment)) {
        const paramName = pathPatternCatchAllSegmentRegex.exec(segment)!.groups!.param

        const paramValue = this.params[paramName] as [string, ...string[]]

        return `${path}/${paramValue.join('/')}`
      }

      if (isSingleParamPathPatternSegment(segment)) {
        const paramName = pathPatternSingleParamSegmentRegex.exec(segment)!.groups!.param

        const paramValue = this.params[paramName] as string

        return `${path}/${paramValue}`
      }

      return `${path}/${segment}`
    }, '')
  }
}
