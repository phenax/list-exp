import {Option} from "fp-ts/lib/Option"
import { constructors, Union } from "./utils"

type _ = never

export type Literal = Union<{
  String: string,
  Number: number,
  Boolean: boolean,
}>
export const Literal = constructors<Literal>()

export type Expr = Union<{
  Start: _,
  End: _,
  Optional: { expr: Expr },
  OneOrMore: { expr: Expr },
  ZeroOrMore: { expr: Expr },
  AnyItem: _,
  Or: { exprs: Expr[] },
  AnyString: _,
  AnyNumber: _,
  AnyBool: _,
  Truthy: _,
  Falsey: _,
  Group: { exprs: Expr[] },
  PropertyMatch: { name: string, expr: Expr },
  Literal: Literal,
  NextItem: _,
}>
export const Expr = constructors<Expr>()

export type ListExpr = [
  Option<Expr>,
  Expr,
  Option<Expr>,
]

