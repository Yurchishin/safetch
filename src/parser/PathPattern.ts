import zod from "zod";
import { ValidatePathPatternError, ValidatePathError } from "./common";
import CatchAllPathPatternSegment from "./OptionalCatchAll";
import OptionalCatchAllPathPatternSegment from "./CatchAll";
import SingleParamPathPatternSegment from "./SingleParam";
import StringPathPatternSegment from "./String";
import type {
  ValidOptionalCatchAllPathPatternSegment,
  ValidateOptionalCatchAllPathPatternSegments,
  PickOptionalCatchAllPathPatternParamNameSegment,
} from "./OptionalCatchAll";
import type {
  ValidCatchAllPathPatternSegment,
  ValidateCatchAllPathPatternSegments,
  PickCatchAllPathPatternParamNameSegment,
} from "./CatchAll";
import type {
  ValidSingleParamPathPatternSegment,
  ValidateSingleParamPathPatternSegments,
  PickSingleParamPathPatternParamNameSegment,
} from "./SingleParam";
import type {
  ValidStringPathPatternSegment,
  ValidateStringPathPatternSegments,
} from "./String";

type PathPatternSegment =
  | CatchAllPathPatternSegment
  | OptionalCatchAllPathPatternSegment
  | SingleParamPathPatternSegment
  | StringPathPatternSegment;

export type ValidatePathPattern<Pattern extends string> = Pattern extends "/"
  ? Pattern
  : Pattern extends `/${string}/`
  ? never
  : Pattern extends `/${infer Segment}/${infer Rest}`
  ? Segment extends ""
    ? never
    : Segment extends ValidOptionalCatchAllPathPatternSegment
    ? ValidateOptionalCatchAllPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : Pattern
    : Segment extends ValidCatchAllPathPatternSegment
    ? ValidateCatchAllPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : Pattern
    : Segment extends ValidSingleParamPathPatternSegment
    ? ValidateSingleParamPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : `/${Segment}${ValidatePathPattern<`/${Rest}`>}`
    : Segment extends ValidStringPathPatternSegment
    ? ValidateStringPathPatternSegments<`${Segment}/${Rest}`> extends never
      ? never
      : `/${Segment}${ValidatePathPattern<`/${Rest}`>}`
    : never
  : Pattern extends `/${infer Segment}`
  ? Segment extends ""
    ? never
    : Segment extends ValidOptionalCatchAllPathPatternSegment
    ? ValidateOptionalCatchAllPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : Segment extends ValidCatchAllPathPatternSegment
    ? ValidateCatchAllPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : Segment extends ValidSingleParamPathPatternSegment
    ? ValidateSingleParamPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : Segment extends ValidStringPathPatternSegment
    ? ValidateStringPathPatternSegments<Segment> extends never
      ? never
      : Pattern
    : never
  : never;

export type ValidPathPattern<Pattern extends string> =
  ValidatePathPattern<Pattern> extends never ? never : Pattern;

export type GetParamsFromPathPattern<P extends string> =
  ValidatePathPattern<P> extends never
    ? never
    : P extends `/${infer Segment}/${infer Rest}`
    ? Segment extends ValidSingleParamPathPatternSegment
      ? GetParamsFromPathPattern<`/${Rest}`> extends null
        ? Record<PickSingleParamPathPatternParamNameSegment<Segment>, string>
        : GetParamsFromPathPattern<`/${Rest}`> &
            Record<PickSingleParamPathPatternParamNameSegment<Segment>, string>
      : GetParamsFromPathPattern<`/${Rest}`>
    : P extends `/${infer Segment}`
    ? Segment extends ValidOptionalCatchAllPathPatternSegment
      ? Record<
          PickOptionalCatchAllPathPatternParamNameSegment<Segment>,
          string[]
        >
      : Segment extends ValidCatchAllPathPatternSegment
      ? Record<
          PickCatchAllPathPatternParamNameSegment<Segment>,
          [string, ...string[]]
        >
      : Segment extends ValidSingleParamPathPatternSegment
      ? Record<PickSingleParamPathPatternParamNameSegment<Segment>, string>
      : null
    : Record<string, string | string[]>;

class PathPattern<Pattern extends string> {
  pattern: ValidPathPattern<Pattern>;
  segments: PathPatternSegment[];
  paramsSchema: zod.AnyZodObject | zod.ZodNull;

  constructor(pattern: ValidPathPattern<Pattern>) {
    if (!pattern.startsWith("/"))
      throw new ValidatePathPatternError('Path pattern must start with "/"');
    if (pattern.includes("//"))
      throw new ValidatePathPatternError('Path pattern must not contain "//"');
    if (pattern !== "/" && pattern.endsWith("/"))
      throw new ValidatePathPatternError('Path pattern must not end with "/"');

    const patternStringSegments = pattern
      .split("/")
      .filter((segment) => segment !== "");

    const segments =
      pattern === "/"
        ? []
        : patternStringSegments.map((patternStringSegment) =>
            this.createSegment(patternStringSegment),
          );

    this.validateInternal(segments, patternStringSegments);

    this.pattern = pattern;
    this.segments = segments;

    const schemaObject = segments.reduce((acc, segment) => {
      if (segment.paramName !== undefined) {
        return { ...acc, ...segment.paramSchema };
      }

      return acc;
    }, {});

    this.paramsSchema =
      Object.keys(schemaObject).length === 0
        ? zod.null()
        : zod.object(schemaObject);
  }

  validatePath(path: string): void {
    if (this.pattern === "/" && path === "/") return;

    if (!path.startsWith("/"))
      throw new ValidatePathError('Path must start with "/"');
    if (path.includes("//"))
      throw new ValidatePathError('Path must not contain "//"');
    if (path.endsWith("/"))
      throw new ValidatePathError('Path must not end with "/"');

    const pathSegments = path.split("/").filter((segment) => segment !== "");

    this.validatePathInternal(this.segments, pathSegments);
  }

  createPath(params: GetParamsFromPathPattern<Pattern>): string {
    this.paramsSchema.parse(params);

    const path = `/${this.segments
      .map((segment) =>
        segment.createPathSegment(
          (params as GetParamsFromPathPattern<Pattern> | null) ?? {},
        ),
      )
      .join("/")}`;

    this.validatePath(path);

    return path;
  }

  private createSegment(segment: string): PathPatternSegment {
    if (OptionalCatchAllPathPatternSegment.is(segment))
      return new OptionalCatchAllPathPatternSegment(segment);
    if (CatchAllPathPatternSegment.is(segment))
      return new CatchAllPathPatternSegment(segment);
    if (SingleParamPathPatternSegment.is(segment))
      return new SingleParamPathPatternSegment(segment);
    if (StringPathPatternSegment.is(segment))
      return new StringPathPatternSegment(segment);

    throw new ValidatePathPatternError(
      `Invalid symbols in segment ${segment as string} at path pattern ${
        this.pattern
      }`,
    );
  }

  private validateInternal(
    segments: readonly PathPatternSegment[],
    patternStringSegments: readonly string[],
  ): void {
    if (patternStringSegments.length === 0) return;

    segments[0].validatePathPatternSegments(patternStringSegments);

    const restPathPatternSegmentsTail = patternStringSegments.slice(1);
    const restSegmentsTail = segments.slice(1);

    this.validateInternal(restSegmentsTail, restPathPatternSegmentsTail);
  }

  private validatePathInternal(
    segments: readonly PathPatternSegment[],
    pathSegments: readonly string[],
  ): void {
    if (segments.length === 0) return;

    segments[0].validatePathSegments(pathSegments);

    const ownPathSegments = segments[0].pickPathSegments(pathSegments);

    const restPathSegmentsTail = [
      ...pathSegments.slice(ownPathSegments.length),
    ];
    const restSegmentsTail = [...segments.slice(1)];

    this.validatePathInternal(restSegmentsTail, restPathSegmentsTail);
  }
}

export default PathPattern;
