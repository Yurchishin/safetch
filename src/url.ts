import { URLError, canParseURL } from './common'
import type { Origin } from './origin'
import type { PathPattern } from './pathPattern'

export type URLHash = `#${string}`

// Really any value is valid here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type URLSearchParamsInfo = Record<string, any>

export type SafeURLOptions<P extends string> = {
  pathPattern: PathPattern<P>
  hash: URLHash | undefined

  search: URLSearchParamsInfo | null
}

export class SafeURL<P extends string> {
  readonly origin: Origin
  readonly pathPattern: PathPattern<P>
  readonly _search: URLSearchParamsInfo | null
  readonly _hash: URLHash | undefined

  constructor(options: SafeURLOptions<P>) {
    const { pathPattern, hash, search } = options

    this.origin = pathPattern.origin
    this.pathPattern = pathPattern
    this._search = search
    this._hash = hash
  }

  search(search: null): SafeURL<P>
  search(search: URLSearchParamsInfo, merge?: boolean): SafeURL<P>
  search(search: URLSearchParamsInfo | null, merge = false): SafeURL<P> {
    if (search === null) {
      return new SafeURL({
        pathPattern: this.pathPattern,
        search: null,
        hash: this._hash,
      })
    }

    return new SafeURL<P>({
      pathPattern: this.pathPattern,
      search: merge ? { ...this._search, ...search } : search,
      hash: this._hash,
    })
  }

  hash(hash: URLHash | undefined): SafeURL<P> {
    return new SafeURL<P>({
      pathPattern: this.pathPattern,
      search: this._search,
      hash,
    })
  }

  toNativeURL() {
    return new URL(this.toString())
  }

  toString(): string {
    const { origin } = this.origin
    const pathname = this.pathPattern.createPathname()
    const search = this.origin.searchStringify(this._search)
    const hash = this._hash ?? ''

    const url = `${origin}${pathname}${search}${hash}`

    if (canParseURL(url)) return url

    throw new URLError(url, 'Invalid path')
  }
}
