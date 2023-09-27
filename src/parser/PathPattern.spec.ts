import { describe, it, expect } from "bun:test";
import { ValidatePathPatternError } from "./common";
import PathPattern from "./PathPattern";
import type { ExpectType, Test } from "@esfx/type-model/test";
import type {
  ValidatePathPattern,
  ValidPathPattern,
  GetParamsFromPathPattern,
} from "./PathPattern";

type _ = [
  Test<ExpectType<ValidatePathPattern<string>, never>>,
  Test<ExpectType<ValidatePathPattern<"">, never>>,
  Test<ExpectType<ValidatePathPattern<"/">, "/">>,
  Test<ExpectType<ValidatePathPattern<"//">, never>>,
  Test<ExpectType<ValidatePathPattern<"foo">, never>>,
  Test<ExpectType<ValidatePathPattern<"/foo/">, never>>,
  Test<ExpectType<ValidatePathPattern<"/foo">, "/foo">>,
  Test<ExpectType<ValidatePathPattern<"/foo/bar">, "/foo/bar">>,
  Test<ExpectType<ValidatePathPattern<"/[foo]">, "/[foo]">>,
  Test<ExpectType<ValidatePathPattern<"/foo/[bar]">, "/foo/[bar]">>,
  Test<ExpectType<ValidatePathPattern<"/foo/[bar]/baz">, "/foo/[bar]/baz">>,
  Test<ExpectType<ValidatePathPattern<"/foo/[bar]/[baz]">, "/foo/[bar]/[baz]">>,
  Test<
    ExpectType<
      ValidatePathPattern<"/foo/[bar]/[baz]/qux">,
      "/foo/[bar]/[baz]/qux"
    >
  >,
  Test<ExpectType<ValidatePathPattern<"/[...foo]">, "/[...foo]">>,
  Test<ExpectType<ValidatePathPattern<"/foo/[...bar]">, "/foo/[...bar]">>,
  Test<ExpectType<ValidatePathPattern<"/foo/[...bar]/baz">, never>>,
  Test<
    ExpectType<
      ValidatePathPattern<"/foo/[bar]/[...baz]">,
      "/foo/[bar]/[...baz]"
    >
  >,
  Test<ExpectType<ValidatePathPattern<"/foo/[bar]/[...baz]/qux">, never>>,
  Test<ExpectType<ValidatePathPattern<"/[...foo]/bar">, never>>,
  Test<ExpectType<ValidatePathPattern<"/[[...foo]]">, "/[[...foo]]">>,
  Test<ExpectType<ValidatePathPattern<"/foo/[[...bar]]">, "/foo/[[...bar]]">>,
  Test<ExpectType<ValidatePathPattern<"/foo/[[...bar]]/baz">, never>>,
  Test<
    ExpectType<
      ValidatePathPattern<"/foo/[bar]/[[...baz]]">,
      "/foo/[bar]/[[...baz]]"
    >
  >,
  Test<ExpectType<ValidatePathPattern<"/foo/[bar]/[[...baz]]/qux">, never>>,
  Test<ExpectType<ValidatePathPattern<"/[[...foo]]/bar">, never>>,
  Test<ExpectType<ValidatePathPattern<"/[[...foo]]/[...bar]">, never>>,

  Test<ExpectType<ValidPathPattern<string>, never>>,
  Test<ExpectType<ValidPathPattern<"">, never>>,
  Test<ExpectType<ValidPathPattern<"/">, "/">>,
  Test<ExpectType<ValidPathPattern<"//">, never>>,
  Test<ExpectType<ValidPathPattern<"foo">, never>>,
  Test<ExpectType<ValidPathPattern<"/foo/">, never>>,
  Test<ExpectType<ValidPathPattern<"/foo">, "/foo">>,
  Test<ExpectType<ValidPathPattern<"/foo/bar">, "/foo/bar">>,

  Test<ExpectType<ValidPathPattern<"/[foo]">, "/[foo]">>,
  Test<ExpectType<ValidPathPattern<"/foo/[bar]">, "/foo/[bar]">>,
  Test<ExpectType<ValidPathPattern<"/foo/[bar]/baz">, "/foo/[bar]/baz">>,
  Test<ExpectType<ValidPathPattern<"/foo/[bar]/[baz]">, "/foo/[bar]/[baz]">>,
  Test<
    ExpectType<ValidPathPattern<"/foo/[bar]/[baz]/qux">, "/foo/[bar]/[baz]/qux">
  >,
  Test<
    ExpectType<
      ValidPathPattern<"/foo/[bar]/test/[baz]/qux">,
      "/foo/[bar]/test/[baz]/qux"
    >
  >,

  Test<ExpectType<ValidPathPattern<"/[...foo]">, "/[...foo]">>,
  Test<ExpectType<ValidPathPattern<"/[...foo]/bar">, never>>,
  Test<ExpectType<ValidPathPattern<"/[...foo]/bar/baz">, never>>,
  Test<ExpectType<ValidPathPattern<"/foo/[...bar]">, "/foo/[...bar]">>,
  Test<ExpectType<ValidPathPattern<"/foo/[...bar]/baz">, never>>,
  Test<
    ExpectType<ValidPathPattern<"/foo/[bar]/[...baz]">, "/foo/[bar]/[...baz]">
  >,
  Test<ExpectType<ValidPathPattern<"/foo/[bar]/[...baz]/qux">, never>>,
  Test<ExpectType<ValidPathPattern<"/foo/[bar]/qux/[...baz]/test">, never>>,

  Test<ExpectType<ValidPathPattern<"/[[...foo]]">, "/[[...foo]]">>,
  Test<ExpectType<ValidPathPattern<"/foo/[[...bar]]">, "/foo/[[...bar]]">>,
  Test<ExpectType<ValidPathPattern<"/foo/[[...bar]]/baz">, never>>,
  Test<
    ExpectType<
      ValidPathPattern<"/foo/[bar]/[[...baz]]">,
      "/foo/[bar]/[[...baz]]"
    >
  >,
  Test<ExpectType<ValidPathPattern<"/foo/[bar]/[[...baz]]/qux">, never>>,
  Test<ExpectType<ValidPathPattern<"/[[...foo]]/bar">, never>>,
  Test<ExpectType<ValidPathPattern<"/[[...foo]]/[...bar]">, never>>,

  Test<ExpectType<GetParamsFromPathPattern<string>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"/">, null>>,
  Test<ExpectType<GetParamsFromPathPattern<"//">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"foo">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"/foo">, null>>,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/bar">, null>>,

  Test<ExpectType<GetParamsFromPathPattern<"/[foo]">, { foo: string }>>,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/[bar]">, { bar: string }>>,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/[bar]/baz">, { bar: string }>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/[baz]">,
      Record<"bar", string> & Record<"baz", string>
    >
  >,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/[baz]/qux">,
      Record<"bar", string> & Record<"baz", string>
    >
  >,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/test/[baz]/qux">,
      Record<"bar", string> & Record<"baz", string>
    >
  >,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/test/[baz]/qux/test2">,
      Record<"bar", string> & Record<"baz", string>
    >
  >,

  Test<
    ExpectType<
      GetParamsFromPathPattern<"/[...foo]">,
      Record<"foo", [string, ...string[]]>
    >
  >,
  Test<ExpectType<GetParamsFromPathPattern<"/[...foo]/bar">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"/[...foo]/bar/baz">, never>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[...bar]">,
      Record<"bar", [string, ...string[]]>
    >
  >,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/[...bar]/baz">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/[...bar]/baz/qux">, never>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/[...baz]">,
      Record<"bar", string> & Record<"baz", [string, ...string[]]>
    >
  >,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/[bar]/[...baz]/qux">, never>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/qux/[...baz]">,
      Record<"bar", string> & Record<"baz", [string, ...string[]]>
    >
  >,
  Test<
    ExpectType<GetParamsFromPathPattern<"/foo/[bar]/qux/[...baz]/test">, never>
  >,

  Test<
    ExpectType<GetParamsFromPathPattern<"/[[...foo]]">, Record<"foo", string[]>>
  >,
  Test<ExpectType<GetParamsFromPathPattern<"/[[...foo]]/bar">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"/[[...foo]]/bar/baz">, never>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[[...bar]]">,
      Record<"bar", string[]>
    >
  >,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/[[...bar]]/baz">, never>>,
  Test<ExpectType<GetParamsFromPathPattern<"/foo/[[...bar]]/baz/qux">, never>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/[[...baz]]">,
      Record<"bar", string> & Record<"baz", string[]>
    >
  >,
  Test<
    ExpectType<GetParamsFromPathPattern<"/foo/[bar]/[[...baz]]/qux">, never>
  >,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/qux/[[...baz]]">,
      Record<"bar", string> & Record<"baz", string[]>
    >
  >,
  Test<
    ExpectType<
      GetParamsFromPathPattern<"/foo/[bar]/qux/[[...baz]]/test">,
      never
    >
  >,
];

describe("PathPattern", () => {
  it.skip("should create a PathPattern object with a valid pattern", () => {
    const pattern = "/";
    const pathPattern = new PathPattern(pattern);
    expect(pathPattern.pattern).toBe(pattern);
    expect(pathPattern.segments.length).toBe(0);
  });

  it.skip("should throw an error when creating a PathPattern object with an invalid pattern", () => {
    // @ts-expect-error: TS2345 because passing an invalid pattern for testing
    expect(() => new PathPattern("//")).toThrow(
      new ValidatePathPatternError('Path pattern must not contain "//"'),
    );
    // @ts-expect-error: TS2345 because passing an invalid pattern for testing
    expect(() => new PathPattern("/user/")).toThrow(
      new ValidatePathPatternError('Path pattern must not end with "/"'),
    );
    // @ts-expect-error: TS2345 because passing an invalid pattern for testing
    expect(() => new PathPattern("user")).toThrow(
      new ValidatePathPatternError('Path pattern must start with "/"'),
    );
  });

  it("should validate a path against the pattern", () => {
    expect(() => new PathPattern("/").validatePath("/foo")).not.toThrow();
    expect(() => new PathPattern("/foo").validatePath("/foo")).not.toThrow();
    expect(() =>
      new PathPattern("/foo/bar").validatePath("/foo"),
    ).not.toThrow();
  });

  // it('should throw an error when validating a path with an invalid pattern', () => {
  //   const pattern = '/foo/[bar]/qux/[...baz]'
  //   const pathPattern = new PathPattern(pattern)
  //   expect(() => pathPattern.validatePath('/users/123/qux')).toThrow()
  // })

  // it('should create a path with valid parameters', () => {
  //   const pattern = '/foo/[bar]/qux/[...baz]'
  //   const pathPattern = new PathPattern(pattern)
  //   const params = { id: '123' }
  //   const path = pathPattern.createPath(params)
  //   expect(path).toBe('/users/123')
  // })
  //
  // it('should throw an error when creating a path with invalid parameters', () => {
  //   const pattern = '/users/:id'
  //   const pathPattern = new PathPattern(pattern)
  //   const params = { id: '123' }
  //   expect(() => pathPattern.createPath({ ...params, extra: '456' })).toThrow(new zod.ZodError('invalid_params'))
  // })
});
