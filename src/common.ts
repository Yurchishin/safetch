export class URLOriginError extends Error {
  constructor(origin: string) {
    super(`[safetch:origin]: ${origin}`)
    this.name = 'URLOriginError'
  }
}

export class URLPathPatternError extends Error {
  constructor(pathPattern: string, message: string) {
    super(`[safetch:path-pattern]: ${message} (${pathPattern})`)
    this.name = 'URLPathPatternError'
  }
}

export class URLError extends Error {
  constructor(url: string, message: string) {
    super(`[safetch:url]: ${message} (${url})`)
    this.name = 'URLError'
  }
}

export const canParseURL = (origin: string): boolean => {
  try {
    const _ = new URL(origin)

    return true
  } catch {
    return false
  }
}
