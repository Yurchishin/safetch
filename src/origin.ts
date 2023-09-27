import { stringify } from 'qs'
import { URLOriginError, canParseURL } from './common'
import { PathPattern } from './pathPattern'
import type { IStringifyOptions } from 'qs'
import type { GetParamsFromPathPattern, ValidPathPattern } from './types/PathPattern'

export type OriginOptions = {
  searchStringifyOptions?: Omit<IStringifyOptions, 'addQueryPrefix'>
}

export class Origin {
  readonly origin: string
  readonly host: string
  readonly hostname: string
  readonly port: string | undefined
  readonly protocol: string
  readonly pureProtocol: string

  private readonly searchStringifyOptions: IStringifyOptions = {
    addQueryPrefix: false,
  }

  constructor(origin: string, options: OriginOptions = {}) {
    const { searchStringifyOptions } = options

    if (!canParseURL(origin)) throw new URLOriginError(origin)

    const url = new URL(origin)

    this.origin = url.origin
    this.host = url.host
    this.hostname = url.hostname
    this.port = url.port === '' ? undefined : url.port
    this.protocol = url.protocol
    this.pureProtocol = url.protocol.slice(0, -1)
    this.searchStringifyOptions = {
      ...searchStringifyOptions,
      addQueryPrefix: true,
    }
  }

  searchStringify(search: Record<string, unknown> | null): string {
    if (search === null) return ''

    return stringify(search, this.searchStringifyOptions)
  }

  pathPattern<P extends string>(pathPattern: ValidPathPattern<P>, params: GetParamsFromPathPattern<P>): PathPattern<P> {
    return new PathPattern<P>(this, pathPattern, params)
  }
}

export const origin = (_origin: string, options?: OriginOptions) => new Origin(_origin, options)
