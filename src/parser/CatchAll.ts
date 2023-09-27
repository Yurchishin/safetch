import zod from "zod";
import {
  pathPatternSegmentValidCharactersRegex,
  ValidatePathPatternError,
  ValidatePathError,
  CatchParamPathPatternSegment,
} from "./common";

export type ValidCatchAllPathPatternSegment = `[...${string}]`;

export type ValidateCatchAllPathPatternSegment<P extends string> =
  P extends ValidCatchAllPathPatternSegment ? P : never;

export type PickCatchAllPathPatternParamNameSegment<P extends string> =
  ValidateCatchAllPathPatternSegment<P> extends never
    ? never
    : ValidateCatchAllPathPatternSegment<P> extends `[...${infer Param}]`
    ? Param
    : never;

export type ValidateCatchAllPathPatternSegments<P extends string> =
  P extends `${string}/${string}`
    ? never
    : P extends ValidateCatchAllPathPatternSegment<P>
    ? P
    : never;

export const pathPatternCatchAllSegmentRegex = /^\[\.{3}(?<param>.+)]$/;

class CatchAllPathPatternSegment extends CatchParamPathPatternSegment<
  ValidCatchAllPathPatternSegment,
  [string, ...string[]]
> {
  static is(segment: string): segment is ValidCatchAllPathPatternSegment {
    return pathPatternCatchAllSegmentRegex.test(segment);
  }

  override paramName: string;
  override paramSchema: Record<string, zod.ZodType<[string, ...string[]]>>;
  override regExp: RegExp;

  constructor(segment: ValidCatchAllPathPatternSegment) {
    super(segment);

    const match = pathPatternCatchAllSegmentRegex.exec(segment);

    if (!match)
      throw new ValidatePathPatternError(
        `Invalid path pattern segment "${segment}"`,
      );

    const { param } = match.groups!;

    this.paramName = param;

    this.paramSchema = { [param]: zod.array(zod.string()).nonempty() };

    // eslint-disable-next-line security/detect-non-literal-regexp
    this.regExp = new RegExp(`^\\[\\.{3}(?<param>(${this.paramName}))]$`);
  }

  matchPathSegments(pathSegments: readonly string[]): boolean {
    const ownPathSegments = this.pickPathSegments(pathSegments);

    return (
      ownPathSegments.length > 0 &&
      ownPathSegments.every((ownPathSegment) =>
        pathPatternSegmentValidCharactersRegex.test(ownPathSegment),
      )
    );
  }

  override validatePathSegments(pathSegments: readonly string[]): void {
    const ownPathSegments = this.pickPathSegments(pathSegments);

    if (ownPathSegments.length === 0)
      throw new ValidatePathError(
        `Catch all segment must have at least one path segment`,
      );

    ownPathSegments.forEach((pathSegment) => {
      if (!pathPatternSegmentValidCharactersRegex.test(pathSegment)) {
        throw new ValidatePathError(
          `Invalid symbols in segment "${pathSegment}" at path`,
        );
      }
    });
  }

  override createPathSegment(
    params: Readonly<Record<string, string | readonly string[]>>,
  ): string {
    const paramValue = params[this.paramName] as [string, ...string[]];

    return paramValue.join("/");
  }
}

export default CatchAllPathPatternSegment;
