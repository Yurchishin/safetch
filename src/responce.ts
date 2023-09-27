class TypeSafeResponse extends Response {
  constructor(response: Response) {
    super(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  }

  // @ts-expect-error: TS2416 because of Bun type definition
  override json() {
    return super.json<unknown>()
  }
}

export default TypeSafeResponse
