import {Option} from "fp-ts/lib/Option"
import { constructors, Union } from "./utils"

type ExprT = {
  Start: null,
  End: null,
  Optional: { expr: Expr },
  OneOrMore: { expr: Expr },
  ZeroOrMore: { expr: Expr },
  NextItem: null,
  AnyItem: null,
  Or: { left: Expr, right: Expr[] },
  AnyString: null,
  AnyNumber: null,
  AnyBool: null,
  Truthy: null,
  Falsey: null,
  Group: { exprs: Expr[] },
  PropertyMatch: { name: string, exprs: Expr[] },
}

export type Expr = Union<ExprT>

export const Expr = constructors<ExprT>()

export type ListExpr = [
  Option<Expr>,
  Expr[],
  Option<Expr>,
]

