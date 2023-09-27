import { describe, expect, it } from 'bun:test'
import { URLError, URLOriginError, URLPathPatternError, canParseURL } from './common'

describe('origin', () => {
  it('URLOriginError', () => {
    const error = new URLOriginError('http://localhost')

    expect(error.message).toBe('[safetch:origin]: http://localhost')
    expect(error.name).toBe('URLOriginError')
  })

  it('URLPathPatternError', () => {
    const error = new URLPathPatternError('/path', 'Invalid path pattern')

    expect(error.message).toBe('[safetch:path-pattern]: Invalid path pattern (/path)')
    expect(error.name).toBe('URLPathPatternError')
  })

  it('URLError', () => {
    const error = new URLError('http://localhost', 'Invalid URL')

    expect(error.message).toBe('[safetch:url]: Invalid URL (http://localhost)')
    expect(error.name).toBe('URLError')
  })

  it('canParseURL', () => {
    const url = 'http://localhost'

    expect(canParseURL(url)).toBe(true)
  })
})
