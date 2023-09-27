export type ValidCatchAllPathPatternSegment = `[...${string}]`

export type ValidateCatchAllPathPatternSegment<P extends string> = P extends ValidCatchAllPathPatternSegment ? P : never

export type PickCatchAllPathPatternParamNameSegment<P extends string> =
  ValidateCatchAllPathPatternSegment<P> extends never
    ? never
    : ValidateCatchAllPathPatternSegment<P> extends `[...${infer Param}]`
    ? Param
    : never

export type ValidateCatchAllPathPatternSegments<P extends string> = P extends `${string}/${string}`
  ? never
  : P extends ValidateCatchAllPathPatternSegment<P>
  ? P
  : never
