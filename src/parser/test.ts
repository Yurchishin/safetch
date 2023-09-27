import { stringify, parse } from "qs";
import type {
  ValidatePathPattern,
  GetParamsFromPathPattern,
  ValidPathPattern,
} from "./PathPattern";

const multiSlashes = /\/{2,}/g;

const pathPatternSegmentValidCharactersRegex = /.+/;

const pathPatternOptionalCatchAllSegmentRegex = /^\[{2}\.{3}(?<param>.+)]{2}$/;
const pathPatternCatchAllSegmentRegex = /^\[\.{3}(?<param>.+)]$/;
const pathPatternSingleParamSegmentRegex = /^\[(?<param>.+)]$/;
const pathPatternStringSegmentRegex = pathPatternSegmentValidCharactersRegex;

class URLOriginError extends TypeError {
  constructor(origin: string) {
    super(`[safetch:origin]: ${origin}`);
    this.name = "URLOriginError";
  }
}

class URLPathPatternError extends Error {
  constructor(pathPattern: string, message: string) {
    super(`[safetch:path-pattern]: ${message} (${pathPattern})`);
    this.name = "URLPathPatternError";
  }
}

const canParseURL = (origin: string): boolean => {
  try {
    const _ = new URL(origin);

    return true;
  } catch {
    return false;
  }
};

export const normalizePathPattern = (pattern: string): string => {
  if (pattern === "/") return pattern;

  // trim string
  if (pattern.trim() !== pattern) return normalizePathPattern(pattern.trim());
  // add leading slash
  if (!pattern.startsWith("/")) return normalizePathPattern(`/${pattern}`);
  // remove trailing slash
  if (pattern.endsWith("/")) return normalizePathPattern(pattern.slice(0, -1));
  // replace multiple slashes with a single slash
  if (multiSlashes.test(pattern))
    return normalizePathPattern(pattern.replaceAll(multiSlashes, "/"));
  // includes hash
  if (pattern.includes("#"))
    throw new URLPathPatternError(
      pattern,
      'Path pattern must not contain hash ("#")',
    );
  // valid
  if (!canParseURL(`http://localhost${pattern}`))
    throw new URLPathPatternError(pattern, "Invalid path pattern");

  return pattern;
};

type SafeURLBaseOptions = {
  origin: string;
  hash?: string;
  // Really any value is valid here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stringifySearch?: (search: Record<string, unknown>) => string;
};

type SafeURLOptions<P extends string> = ValidatePathPattern<P> extends never
  ? never
  : GetParamsFromPathPattern<P> extends null
  ? SafeURLBaseOptions & {
      params?: never;
      pathPattern: ValidPathPattern<P>;
    }
  : SafeURLBaseOptions & {
      pathPattern: ValidPathPattern<P>;
      params: GetParamsFromPathPattern<P>;
    };

class SafeURL<P extends string> extends URL {
  constructor(options: SafeURLOptions<P>) {
    super(`http://localhost`);
  }
}
