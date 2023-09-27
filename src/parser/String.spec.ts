import { describe, it, expect } from "bun:test";
import { ValidatePathPatternError, ValidatePathError } from "./common";
import StringPathPatternSegment from "./String";
import type { Test, ExpectType } from "@esfx/type-model/test";
import type {
  ValidateStringPathPatternSegment,
  ValidateStringPathPatternSegments,
} from "./String";

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  // Type check tests for ValidateStringPathPatternSegment
  Test<ExpectType<ValidateStringPathPatternSegment<"[param]">, never>>,
  Test<ExpectType<ValidateStringPathPatternSegment<"[...param]">, never>>,
  Test<ExpectType<ValidateStringPathPatternSegment<"[[...param]]">, never>>,
  Test<ExpectType<ValidateStringPathPatternSegment<"param">, "param">>,
  // Type check tests for ValidateStringPathPatternSegments
  Test<ExpectType<ValidateStringPathPatternSegments<"param">, "param">>,
  Test<ExpectType<ValidateStringPathPatternSegments<"[param]">, never>>,
  Test<ExpectType<ValidateStringPathPatternSegments<"[[...param]]">, never>>,
  Test<
    ExpectType<
      ValidateStringPathPatternSegments<"[...param]/[[...param2]]">,
      never
    >
  >,
  Test<
    ExpectType<
      ValidateStringPathPatternSegments<"[...param]/[...param2]">,
      never
    >
  >,
  Test<
    ExpectType<
      ValidateStringPathPatternSegments<"[[...param]]/[param2]">,
      never
    >
  >,
  Test<
    ExpectType<ValidateStringPathPatternSegments<"[...param]/param2">, never>
  >,
];
/// //////////////////////////////////////////////////////////////////////////////////

describe("SingleParam", () => {
  it("should succeed creating instance with a valid path pattern segment", () => {
    const segment = new StringPathPatternSegment("testParam");

    expect(segment.segment).toBe("testParam");
    expect(segment.paramName).toBe(undefined);
    expect(segment.paramSchema).toEqual(null);
    expect(segment.regExp).toEqual(/^testParam$/);
  });

  it("should correctly identify valid path pattern segment", () => {
    expect(StringPathPatternSegment.is("testParam")).toBe(true);
    expect(StringPathPatternSegment.is("[testParam]")).toBe(false);
    expect(StringPathPatternSegment.is("[...testParam]")).toBe(false);
    expect(StringPathPatternSegment.is("[[...testParam]]")).toBe(false);
  });

  it("should correctly match valid path pattern segment", () => {
    const segment = new StringPathPatternSegment("testParam");

    expect(segment.matchPathPattern("testParam")).toBe(true);
    expect(segment.matchPathPattern("testParam2")).toBe(false);
    expect(segment.matchPathPattern("[testParam]")).toBe(false);
    expect(segment.matchPathPattern("[...testParam]")).toBe(false);
    expect(segment.matchPathPattern("[[...testParam]]")).toBe(false);
  });

  it("should correctly validate valid path pattern segments", () => {
    const segment = new StringPathPatternSegment("testParam");

    expect(() =>
      segment.validatePathPatternSegments(["testParam"]),
    ).not.toThrow();
    expect(() => segment.validatePathPatternSegments(["testParam2"])).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "testParam" at path pattern',
      ),
    );
    expect(() => segment.validatePathPatternSegments(["[testParam]"])).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "testParam" at path pattern',
      ),
    );
    expect(() =>
      segment.validatePathPatternSegments(["[...testParam]"]),
    ).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "testParam" at path pattern',
      ),
    );
    expect(() =>
      segment.validatePathPatternSegments(["[[...testParam]]"]),
    ).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "testParam" at path pattern',
      ),
    );
  });

  it("should correctly pick path segments", () => {
    const segment = new StringPathPatternSegment("testParam");

    expect(segment.pickPathSegments(["testParam", "testParam2"])).toEqual([
      "testParam",
    ]);
    expect(segment.pickPathSegments(["testParam"])).toEqual(["testParam"]);
    expect(segment.pickPathSegments([])).toEqual([]);
  });

  it("should correctly match path segments", () => {
    const segment = new StringPathPatternSegment("testParam");

    expect(segment.matchPathSegments(["testParam", "testParam2"])).toBe(true);
    expect(segment.matchPathSegments(["testParam"])).toBe(true);
    expect(segment.matchPathSegments(["testParam2"])).toBe(false);
    expect(segment.matchPathSegments([])).toBe(false);
  });

  it("should correctly validate path segments", () => {
    const segment = new StringPathPatternSegment("testParam");

    expect(() =>
      segment.validatePathSegments(["testParam", "testParam2"]),
    ).not.toThrow();
    expect(() => segment.validatePathSegments(["testParam"])).not.toThrow();
    expect(() => segment.validatePathSegments(["testParam2"])).toThrow(
      new ValidatePathError('Invalid symbols in segment "testParam2" at path'),
    );
    expect(() => segment.validatePathSegments([])).toThrow(
      new ValidatePathError(
        "String segment must have at least one path segment",
      ),
    );
  });

  it("should correctly create path segment", () => {
    const segment = new StringPathPatternSegment("testParam");

    expect(segment.createPathSegment({})).toBe("testParam");
    expect(segment.createPathSegment({})).toBe("testParam");
  });
});
