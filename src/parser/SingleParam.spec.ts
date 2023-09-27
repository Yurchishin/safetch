import { describe, it, expect } from "bun:test";
import z from "zod";
import { ValidatePathPatternError, ValidatePathError } from "./common";
import SingleParam from "./SingleParam";
import type { Test, ExpectType } from "@esfx/type-model/test";
import type {
  ValidateSingleParamPathPatternSegment,
  PickSingleParamPathPatternParamNameSegment,
  ValidateSingleParamPathPatternSegments,
} from "./SingleParam";

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  // Type check tests for ValidateSingleParamPathPatternSegment
  Test<ExpectType<ValidateSingleParamPathPatternSegment<"[param]">, "[param]">>,
  Test<ExpectType<ValidateSingleParamPathPatternSegment<"[...param]">, never>>,
  Test<
    ExpectType<ValidateSingleParamPathPatternSegment<"[[...param]]">, never>
  >,
  // Type check tests for PickSingleParamPathPatternParamNameSegment
  Test<
    ExpectType<PickSingleParamPathPatternParamNameSegment<"[param]">, "param">
  >,
  Test<
    ExpectType<
      PickSingleParamPathPatternParamNameSegment<"[[...param]]">,
      never
    >
  >,
  // Type check tests for ValidateSingleParamPathPatternSegments
  Test<
    ExpectType<ValidateSingleParamPathPatternSegments<"[param]">, "[param]">
  >,
  Test<
    ExpectType<ValidateSingleParamPathPatternSegments<"[[...param]]">, never>
  >,
  Test<
    ExpectType<
      ValidateSingleParamPathPatternSegments<"[...param]/[[...param2]]">,
      never
    >
  >,
  Test<
    ExpectType<
      ValidateSingleParamPathPatternSegments<"[...param]/[...param2]">,
      never
    >
  >,
  Test<
    ExpectType<
      ValidateSingleParamPathPatternSegments<"[[...param]]/[param2]">,
      never
    >
  >,
  Test<
    ExpectType<
      ValidateSingleParamPathPatternSegments<"[...param]/param2">,
      never
    >
  >,
];
/// //////////////////////////////////////////////////////////////////////////////////

describe("SingleParam", () => {
  it("should succeed creating instance with a valid path pattern segment", () => {
    const segment = new SingleParam("[testParam]");

    expect(segment.segment).toBe("[testParam]");
    expect(segment.paramName).toBe("testParam");
    expect(segment.paramSchema).toEqual({ testParam: expect.any(z.ZodString) });
    expect(segment.regExp).toEqual(/^\[(?<param>(testParam))]$/);
  });

  it("should correctly identify valid path pattern segment", () => {
    expect(SingleParam.is("testParam")).toBe(false);
    expect(SingleParam.is("[testParam]")).toBe(true);
    expect(SingleParam.is("[...testParam]")).toBe(false);
    expect(SingleParam.is("[[...testParam]]")).toBe(false);
  });

  it("should correctly match valid path pattern segment", () => {
    const segment = new SingleParam("[testParam]");

    expect(segment.matchPathPattern("[testParam]")).toBe(true);
    expect(segment.matchPathPattern("testParam")).toBe(false);
    expect(segment.matchPathPattern("testParam2")).toBe(false);
    expect(segment.matchPathPattern("[testParam2]")).toBe(false);
    expect(segment.matchPathPattern("[...testParam]")).toBe(false);
    expect(segment.matchPathPattern("[[...testParam]]")).toBe(false);
  });

  it("should correctly validate valid path pattern segments", () => {
    const segment = new SingleParam("[testParam]");

    expect(() =>
      segment.validatePathPatternSegments(["[testParam]"]),
    ).not.toThrow();
    expect(() => segment.validatePathPatternSegments(["[testParam2]"])).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "[testParam]" at path pattern',
      ),
    );
    expect(() => segment.validatePathPatternSegments(["testParam"])).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "[testParam]" at path pattern',
      ),
    );
    expect(() =>
      segment.validatePathPatternSegments(["[...testParam]"]),
    ).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "[testParam]" at path pattern',
      ),
    );
    expect(() =>
      segment.validatePathPatternSegments(["[[...testParam]]"]),
    ).toThrow(
      new ValidatePathPatternError(
        'Invalid symbols in segment "[testParam]" at path pattern',
      ),
    );
  });

  it("should correctly pick path segments", () => {
    const segment = new SingleParam("[testParam]");

    expect(segment.pickPathSegments(["testParam", "testParam2"])).toEqual([
      "testParam",
    ]);
    expect(segment.pickPathSegments(["testParam"])).toEqual(["testParam"]);
    expect(segment.pickPathSegments([])).toEqual([]);
  });

  it("should correctly match path segments", () => {
    const segment = new SingleParam("[testParam]");

    expect(segment.matchPathSegments(["testParam", "testParam2"])).toBe(true);
    expect(segment.matchPathSegments(["testParam"])).toBe(true);
    expect(segment.matchPathSegments(["testParam2"])).toBe(true);
    expect(segment.matchPathSegments([])).toBe(false);
  });

  it("should correctly validate path segments", () => {
    const segment = new SingleParam("[testParam]");

    expect(() =>
      segment.validatePathSegments(["testParam", "testParam2"]),
    ).not.toThrow();
    expect(() => segment.validatePathSegments(["testParam"])).not.toThrow();
    expect(() => segment.validatePathSegments(["testParam2"])).not.toThrow();
    expect(() => segment.validatePathSegments([])).toThrow(
      new ValidatePathError(
        "Single segment must have at least one path segment",
      ),
    );
  });

  it("should correctly create path segment", () => {
    const segment = new SingleParam("[testParam]");

    expect(segment.createPathSegment({ testParam: "testParam" })).toBe(
      "testParam",
    );
    expect(segment.createPathSegment({ testParam: "testParam2" })).toBe(
      "testParam2",
    );
  });
});
