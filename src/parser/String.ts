import {
  pathPatternSegmentValidCharactersRegex,
  ValidatePathPatternError,
  ValidatePathError,
  NonParamPathPatternSegment,
} from "./common";
import CatchAllPathPatternSegment from "./OptionalCatchAll";
import OptionalCatchAllPathPatternSegment from "./CatchAll";
import SingleParamPathPatternSegment from "./SingleParam";
import type { ValidCatchAllPathPatternSegment } from "./CatchAll";
import type { ValidOptionalCatchAllPathPatternSegment } from "./OptionalCatchAll";
import type { ValidSingleParamPathPatternSegment } from "./SingleParam";

export type ValidStringPathPatternSegment = string;

export type ValidateStringPathPatternSegment<P extends string> =
  P extends ValidOptionalCatchAllPathPatternSegment
    ? never
    : P extends ValidCatchAllPathPatternSegment
    ? never
    : P extends ValidSingleParamPathPatternSegment
    ? never
    : P;

export type ValidateStringPathPatternSegments<P extends string> =
  P extends `${infer Head}/${string}`
    ? ValidateStringPathPatternSegment<Head> extends never
      ? never
      : P
    : P extends ValidateStringPathPatternSegment<P>
    ? P
    : never;

class StringPathPatternSegment extends NonParamPathPatternSegment {
  static is(segment: string): segment is string {
    if (CatchAllPathPatternSegment.is(segment)) return false;
    if (OptionalCatchAllPathPatternSegment.is(segment)) return false;
    if (SingleParamPathPatternSegment.is(segment)) return false;

    return pathPatternSegmentValidCharactersRegex.test(segment);
  }

  override regExp: RegExp;

  constructor(segment: string) {
    super(segment);

    // eslint-disable-next-line security/detect-non-literal-regexp
    this.regExp = new RegExp(`^${this.segment}$`);
  }

  override matchPathPattern(segment: string): boolean {
    return this.regExp.test(segment);
  }

  override validatePathPatternSegments(
    restPathPatternSegments: readonly string[],
  ): void {
    console.log(
      "restPathPatternSegmentsrestPathPatternSegments",
      restPathPatternSegments,
    );
    if (!this.matchPathPattern(restPathPatternSegments[0]))
      throw new ValidatePathPatternError(
        `Invalid symbols in segment "${this.segment}" at path pattern`,
      );
  }

  override pickPathSegments(pathSegments: readonly string[]): string[] {
    return pathSegments[0] ? [pathSegments[0]] : [];
  }

  override matchPathSegments(pathSegments: readonly string[]): boolean {
    const ownPathSegments = this.pickPathSegments(pathSegments);

    return (
      ownPathSegments.length > 0 &&
      ownPathSegments.every((ownPathSegment) =>
        this.regExp.test(ownPathSegment),
      )
    );
  }

  override validatePathSegments(pathSegments: readonly string[]): void {
    const ownPathSegments = this.pickPathSegments(pathSegments);

    if (ownPathSegments.length === 0)
      throw new ValidatePathError(
        `String segment must have at least one path segment`,
      );

    ownPathSegments.forEach((pathSegment) => {
      if (!this.regExp.test(pathSegment)) {
        throw new ValidatePathError(
          `Invalid symbols in segment "${pathSegment}" at path`,
        );
      }
    });
  }
}

export default StringPathPatternSegment;
