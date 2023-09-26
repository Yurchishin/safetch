import type zod from 'zod'

export class ResponseJsonParseError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'ResponseJsonParseError'
  }
}

class TypeSafeResponse extends Response {
  constructor(response: Response) {
    super(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  }

  // @ts-expect-error: TS2416 because of Bun type definition
  override json(): Promise<unknown> {
    return this.jsonParse()
  }

  async safeJson<S extends zod.ZodType>(Schema: S): Promise<zod.infer<S>> {
    const json = await this.jsonParse()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Schema.parse(json)
  }

  private jsonParse(): Promise<unknown> {
    try {
      return super.json()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error error'

      throw new ResponseJsonParseError(message)
    }
  }
}

export default TypeSafeResponse
