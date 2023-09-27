import type zod from "zod";

export const pathPatternSegmentValidCharactersRegex = /.+/;

export class ValidatePathPatternError extends Error {
  readonly name = "ValidatePathPatternError";

  constructor(message: string) {
    super(`Invalid path pattern: ${message}`);
  }
}

export class ValidatePathError extends Error {
  readonly name = "ValidatePathError";

  constructor(message: string) {
    super(`Invalid path: ${message}`);
  }
}

export abstract class PathPatternSegment<
  S extends string,
  P extends string | string[] | null,
> {
  abstract paramName: string | undefined;
  abstract paramSchema: P extends null
    ? null
    : Record<string, zod.ZodDefault<zod.ZodType<P>> | zod.ZodType<P>>;
  abstract regExp: RegExp;

  segment: S;

  constructor(segment: S) {
    this.segment = segment;
  }

  abstract matchPathPattern(restPathPatternSegments: string): boolean;
  abstract validatePathPatternSegments(
    restPathPatternSegments: readonly string[],
  ): void;

  abstract pickPathSegments(pathSegments: readonly string[]): string[];
  abstract matchPathSegments(pathSegments: readonly string[]): boolean;
  abstract validatePathSegments(pathSegments: readonly string[]): void;

  abstract createPathSegment(
    parameters: Readonly<Record<string, string | readonly string[]>>,
  ): string;
}

export abstract class NonParamPathPatternSegment extends PathPatternSegment<
  string,
  null
> {
  override paramName = undefined;
  override paramSchema = null;

  override createPathSegment(
    _: Readonly<Record<string, string | readonly string[]>>,
  ): string {
    return `${this.segment}`;
  }
}

export abstract class ParamPathPatternSegment<
  S extends string,
  P extends string | string[],
> extends PathPatternSegment<S, P> {
  abstract override paramName: string;
}

export abstract class CatchParamPathPatternSegment<
  S extends string,
  P extends string[],
> extends ParamPathPatternSegment<S, P> {
  override matchPathPattern(segment: string): boolean {
    return this.regExp.test(segment);
  }

  override validatePathPatternSegments(
    restPathPatternSegments: readonly string[],
  ): void {
    if (!this.matchPathPattern(restPathPatternSegments[0]))
      throw new ValidatePathPatternError(
        `Invalid symbols in segment "${this.segment}"`,
      );
    if (restPathPatternSegments.length > 1)
      throw new ValidatePathPatternError(
        `Optional catch all segment must be last segment in path pattern "${this.segment}"`,
      );
  }

  override pickPathSegments(pathSegments: readonly string[]): string[] {
    return [...pathSegments];
  }
}
