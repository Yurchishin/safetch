import zod from "zod";
import {
  pathPatternSegmentValidCharactersRegex,
  ValidatePathPatternError,
  ValidatePathError,
  CatchParamPathPatternSegment,
} from "./common";

export type ValidOptionalCatchAllPathPatternSegment = `[[...${string}]]`;

export type ValidateOptionalCatchAllPathPatternSegment<P extends string> =
  P extends ValidOptionalCatchAllPathPatternSegment ? P : never;

export type PickOptionalCatchAllPathPatternParamNameSegment<P extends string> =
  ValidateOptionalCatchAllPathPatternSegment<P> extends never
    ? never
    : ValidateOptionalCatchAllPathPatternSegment<P> extends `[[...${infer Param}]]`
    ? Param
    : never;

export type ValidateOptionalCatchAllPathPatternSegments<P extends string> =
  P extends `${string}/${string}`
    ? never
    : P extends ValidateOptionalCatchAllPathPatternSegment<P>
    ? P
    : never;

export const pathPatternOptionalCatchAllSegmentRegex =
  /^\[{2}\.{3}(?<param>.+)]{2}$/;

class OptionalCatchAllPathPatternSegment extends CatchParamPathPatternSegment<
  ValidOptionalCatchAllPathPatternSegment,
  string[]
> {
  static is(
    segment: string,
  ): segment is ValidOptionalCatchAllPathPatternSegment {
    return pathPatternOptionalCatchAllSegmentRegex.test(segment);
  }

  override paramName: string;
  override paramSchema: Record<
    string,
    zod.ZodDefault<zod.ZodArray<zod.ZodString>>
  >;
  override regExp: RegExp;

  constructor(segment: ValidOptionalCatchAllPathPatternSegment) {
    super(segment);

    const match = pathPatternOptionalCatchAllSegmentRegex.exec(segment);

    if (!match)
      throw new ValidatePathPatternError(
        `Invalid path pattern segment "${segment}"`,
      );

    const { param } = match.groups!;

    this.paramName = param;

    this.paramSchema = { [param]: zod.array(zod.string()).default([]) };

    // eslint-disable-next-line security/detect-non-literal-regexp
    this.regExp = new RegExp(
      `^\\[\\[\\.\\.\\.(?<param>(${this.paramName}))]]$`,
    );
  }

  matchPathSegments(pathSegments: readonly string[]): boolean {
    const ownPathSegments = this.pickPathSegments(pathSegments);

    return ownPathSegments.every((ownPathSegment) =>
      pathPatternSegmentValidCharactersRegex.test(ownPathSegment),
    );
  }

  override validatePathSegments(pathSegments: readonly string[]): void {
    const ownPathSegments = this.pickPathSegments(pathSegments);

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
    const paramValue = params[this.paramName] as string[];

    return paramValue.join("/");
  }
}

export default OptionalCatchAllPathPatternSegment;
