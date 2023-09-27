import { describe, it, expect } from "bun:test";
import zod from "zod";
import { ValidatePathPatternError, ValidatePathError } from "./common";
import CatchAll from "./CatchAll";
import type { Test, ExpectType } from "@esfx/type-model/test";
import type {
  ValidateCatchAllPathPatternSegment,
  PickCatchAllPathPatternParamNameSegment,
  ValidateCatchAllPathPatternSegments,
} from "./CatchAll";

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  // Type check tests for ValidateCatchAllPathPatternSegment
  Test<
    ExpectType<ValidateCatchAllPathPatternSegment<"[...param]">, "[...param]">
  >,
  Test<ExpectType<ValidateCatchAllPathPatternSegment<"[[...param]]">, never>>,
  // Type check tests for PickCatchAllPathPatternParamNameSegment
  Test<
    ExpectType<PickCatchAllPathPatternParamNameSegment<"[...param]">, "param">
  >,
  Test<
    ExpectType<PickCatchAllPathPatternParamNameSegment<"[[...param]]">, never>
  >,
  // Type check tests for ValidateCatchAllPathPatternSegments
  Test<
    ExpectType<ValidateCatchAllPathPatternSegments<"[...param]">, "[...param]">
  >,
  Test<ExpectType<ValidateCatchAllPathPatternSegments<"[[...param]]">, never>>,
  Test<
    ExpectType<
      ValidateCatchAllPathPatternSegments<"[...param]/[[...param2]]">,
      never
    >
  >,
  Test<
    ExpectType<
      ValidateCatchAllPathPatternSegments<"[...param]/[...param2]">,
      never
    >
  >,
  Test<
    ExpectType<
      ValidateCatchAllPathPatternSegments<"[[...param]]/[param2]">,
      never
    >
  >,
  Test<
    ExpectType<ValidateCatchAllPathPatternSegments<"[...param]/param2">, never>
  >,
];
/// //////////////////////////////////////////////////////////////////////////////////

describe("CatchAll", () => {
  it("should succeed creating instance with a valid path pattern segment", () => {
    const segment = new CatchAll("[...testParam]");

    expect(segment.segment).toBe("[...testParam]");
    expect(segment.paramName).toBe("testParam");
    expect(segment.paramSchema).toEqual({
      testParam: expect.any(zod.ZodArray),
    });
    expect(segment.regExp).toEqual(/^\[\.{3}(?<param>(testParam))]$/);
  });

  it("should throw an error creating instance with an invalid path pattern segment", () => {
    // @ts-expect-error: TS2345 because testParam is not a valid path pattern segment
    expect(() => new CatchAll("[...testParam]/test")).toThrow(
      new ValidatePathPatternError(
        'Invalid path pattern segment "[...testParam]/test"',
      ),
    );
  });

  it("should correctly identify valid path pattern segment", () => {
    expect(CatchAll.is("testParam")).toBe(false);
    expect(CatchAll.is("[testParam]")).toBe(false);
    expect(CatchAll.is("[...testParam]")).toBe(true);
    expect(CatchAll.is("[[...testParam]]")).toBe(false);
  });

  it("should correctly match valid path pattern segment", () => {
    const segment = new CatchAll("[...testParam]");

    expect(segment.matchPathPattern("[...testParam]")).toBe(true);
    expect(segment.matchPathPattern("[...testParam2]")).toBe(false);
  });

  it("should correctly validate valid path pattern segments", () => {
    const segment = new CatchAll("[...testParam]");

    expect(() =>
      segment.validatePathPatternSegments(["[...testParam]"]),
    ).not.toThrow();
    expect(() =>
      segment.validatePathPatternSegments(["[...testParam2]"]),
    ).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "[...testParam]"',
      ),
    );
    expect(() =>
      segment.validatePathPatternSegments([
        "[...testParam]",
        "[...testParam2]",
      ]),
    ).toThrow(
      new ValidatePathPatternError(
        'Optional catch all segment must be last segment in path pattern "[...testParam]"',
      ),
    );
  });

  it("should correctly pick path segments", () => {
    const segment = new CatchAll("[...testParam]");

    expect(segment.pickPathSegments(["test", "test2"])).toEqual([
      "test",
      "test2",
    ]);
  });

  it("should correctly match path segments", () => {
    const segment = new CatchAll("[...testParam]");

    expect(segment.matchPathSegments(["test", "test2"])).toBe(true);
    expect(segment.matchPathSegments(["test"])).toBe(true);
    expect(segment.matchPathSegments(["test2"])).toBe(true);
    expect(segment.matchPathSegments([])).toBe(false);
  });

  it("should correctly validate path segments", () => {
    const segment = new CatchAll("[...testParam]");

    expect(() => segment.validatePathSegments(["test", "test2"])).not.toThrow();
    expect(() => segment.validatePathSegments(["test"])).not.toThrow();
    expect(() => segment.validatePathSegments(["test2"])).not.toThrow();
    expect(() => segment.validatePathSegments([])).toThrow(
      new ValidatePathError(
        "Catch all segment must have at least one path segment",
      ),
    );
  });

  it("should correctly create path segment", () => {
    const segment = new CatchAll("[...testParam]");

    expect(segment.createPathSegment({ testParam: ["test", "test2"] })).toBe(
      "test/test2",
    );
  });
});
