export type ValidOptionalCatchAllPathPatternSegment = `[[...${string}]]`

export type ValidateOptionalCatchAllPathPatternSegment<P extends string> =
  P extends ValidOptionalCatchAllPathPatternSegment ? P : never

export type PickOptionalCatchAllPathPatternParamNameSegment<P extends string> =
  ValidateOptionalCatchAllPathPatternSegment<P> extends never
    ? never
    : ValidateOptionalCatchAllPathPatternSegment<P> extends `[[...${infer Param}]]`
    ? Param
    : never

export type ValidateOptionalCatchAllPathPatternSegments<P extends string> = P extends `${string}/${string}`
  ? never
  : P extends ValidateOptionalCatchAllPathPatternSegment<P>
  ? P
  : never
