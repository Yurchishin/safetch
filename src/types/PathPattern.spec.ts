import type { ExpectType, Test } from '@esfx/type-model/test'
import type { ValidatePathPattern, ValidPathPattern, GetParamsFromPathPattern } from './PathPattern'

/// //////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////// Type check tests ///////////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////////
type _ = [
  Test<ExpectType<ValidatePathPattern<string>, never>>,
  Test<ExpectType<ValidatePathPattern<''>, never>>,
  Test<ExpectType<ValidatePathPattern<'/'>, '/'>>,
  Test<ExpectType<ValidatePathPattern<'//'>, never>>,
  Test<ExpectType<ValidatePathPattern<'foo'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/foo/'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/foo'>, '/foo'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/bar'>, '/foo/bar'>>,
  Test<ExpectType<ValidatePathPattern<'/[foo]'>, '/[foo]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]'>, '/foo/[bar]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]/baz'>, '/foo/[bar]/baz'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]/[baz]'>, '/foo/[bar]/[baz]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]/[baz]/qux'>, '/foo/[bar]/[baz]/qux'>>,
  Test<ExpectType<ValidatePathPattern<'/[...foo]'>, '/[...foo]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[...bar]'>, '/foo/[...bar]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[...bar]/baz'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]/[...baz]'>, '/foo/[bar]/[...baz]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]/[...baz]/qux'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/[...foo]/bar'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/[[...foo]]'>, '/[[...foo]]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[[...bar]]'>, '/foo/[[...bar]]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[[...bar]]/baz'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]/[[...baz]]'>, '/foo/[bar]/[[...baz]]'>>,
  Test<ExpectType<ValidatePathPattern<'/foo/[bar]/[[...baz]]/qux'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/[[...foo]]/bar'>, never>>,
  Test<ExpectType<ValidatePathPattern<'/[[...foo]]/[...bar]'>, never>>,

  Test<ExpectType<ValidPathPattern<string>, never>>,
  Test<ExpectType<ValidPathPattern<''>, never>>,
  Test<ExpectType<ValidPathPattern<'/'>, '/'>>,
  Test<ExpectType<ValidPathPattern<'//'>, never>>,
  Test<ExpectType<ValidPathPattern<'foo'>, never>>,
  Test<ExpectType<ValidPathPattern<'/foo/'>, never>>,
  Test<ExpectType<ValidPathPattern<'/foo'>, '/foo'>>,
  Test<ExpectType<ValidPathPattern<'/foo/bar'>, '/foo/bar'>>,

  Test<ExpectType<ValidPathPattern<'/[foo]'>, '/[foo]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]'>, '/foo/[bar]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/baz'>, '/foo/[bar]/baz'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/[baz]'>, '/foo/[bar]/[baz]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/[baz]/qux'>, '/foo/[bar]/[baz]/qux'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/test/[baz]/qux'>, '/foo/[bar]/test/[baz]/qux'>>,

  Test<ExpectType<ValidPathPattern<'/[...foo]'>, '/[...foo]'>>,
  Test<ExpectType<ValidPathPattern<'/[...foo]/bar'>, never>>,
  Test<ExpectType<ValidPathPattern<'/[...foo]/bar/baz'>, never>>,
  Test<ExpectType<ValidPathPattern<'/foo/[...bar]'>, '/foo/[...bar]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[...bar]/baz'>, never>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/[...baz]'>, '/foo/[bar]/[...baz]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/[...baz]/qux'>, never>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/qux/[...baz]/test'>, never>>,

  Test<ExpectType<ValidPathPattern<'/[[...foo]]'>, '/[[...foo]]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[[...bar]]'>, '/foo/[[...bar]]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[[...bar]]/baz'>, never>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/[[...baz]]'>, '/foo/[bar]/[[...baz]]'>>,
  Test<ExpectType<ValidPathPattern<'/foo/[bar]/[[...baz]]/qux'>, never>>,
  Test<ExpectType<ValidPathPattern<'/[[...foo]]/bar'>, never>>,
  Test<ExpectType<ValidPathPattern<'/[[...foo]]/[...bar]'>, never>>,

  Test<ExpectType<GetParamsFromPathPattern<string>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<''>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/'>, null>>,
  Test<ExpectType<GetParamsFromPathPattern<'//'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'foo'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo'>, null>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/bar'>, null>>,

  Test<ExpectType<GetParamsFromPathPattern<'/[foo]'>, { foo: string }>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]'>, { bar: string }>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/baz'>, { bar: string }>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/[baz]'>, Record<'bar', string> & Record<'baz', string>>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/[baz]/qux'>, Record<'bar', string> & Record<'baz', string>>>,
  Test<
    ExpectType<GetParamsFromPathPattern<'/foo/[bar]/test/[baz]/qux'>, Record<'bar', string> & Record<'baz', string>>
  >,
  Test<
    ExpectType<
      GetParamsFromPathPattern<'/foo/[bar]/test/[baz]/qux/test2'>,
      Record<'bar', string> & Record<'baz', string>
    >
  >,

  Test<ExpectType<GetParamsFromPathPattern<'/[...foo]'>, Record<'foo', [string, ...string[]]>>>,
  Test<ExpectType<GetParamsFromPathPattern<'/[...foo]/bar'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/[...foo]/bar/baz'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[...bar]'>, Record<'bar', [string, ...string[]]>>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[...bar]/baz'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[...bar]/baz/qux'>, never>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<'/foo/[bar]/[...baz]'>,
      Record<'bar', string> & Record<'baz', [string, ...string[]]>
    >
  >,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/[...baz]/qux'>, never>>,
  Test<
    ExpectType<
      GetParamsFromPathPattern<'/foo/[bar]/qux/[...baz]'>,
      Record<'bar', string> & Record<'baz', [string, ...string[]]>
    >
  >,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/qux/[...baz]/test'>, never>>,

  Test<ExpectType<GetParamsFromPathPattern<'/[[...foo]]'>, Record<'foo', string[]>>>,
  Test<ExpectType<GetParamsFromPathPattern<'/[[...foo]]/bar'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/[[...foo]]/bar/baz'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[[...bar]]'>, Record<'bar', string[]>>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[[...bar]]/baz'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[[...bar]]/baz/qux'>, never>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/[[...baz]]'>, Record<'bar', string> & Record<'baz', string[]>>>,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/[[...baz]]/qux'>, never>>,
  Test<
    ExpectType<GetParamsFromPathPattern<'/foo/[bar]/qux/[[...baz]]'>, Record<'bar', string> & Record<'baz', string[]>>
  >,
  Test<ExpectType<GetParamsFromPathPattern<'/foo/[bar]/qux/[[...baz]]/test'>, never>>,
]
/// //////////////////////////////////////////////////////////////////////////////////
