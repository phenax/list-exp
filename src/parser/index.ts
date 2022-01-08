import { pipe } from 'fp-ts/function'
import { chain, orElse, right } from 'fp-ts/lib/Either'
import {
  delimited,
  many1,
  mapTo,
  optional,
  or,
  Parser,
  ParserResult,
  symbol,
  tuple3,
} from './utils'
import { Expr } from '../types'

export const start = mapTo(symbol('^'), () => Expr.Start(null))
export const end = mapTo(symbol('$'), () => Expr.End(null))
export const anyItem = mapTo(symbol('.'), () => Expr.AnyItem(null))
export const nextItem = mapTo(symbol(','), () => Expr.NextItem(null))
export const anyString = mapTo(symbol('\\s'), () => Expr.AnyString(null))
export const anyNumber = mapTo(symbol('\\n'), () => Expr.AnyNumber(null))
export const anyBool = mapTo(symbol('\\b'), () => Expr.AnyBool(null))
export const truthy = mapTo(symbol('\\T'), () => Expr.Truthy(null))
export const falsey = mapTo(symbol('\\F'), () => Expr.Falsey(null))

export const wrapQuantifiers: (e: ParserResult<Expr>) => ParserResult<Expr> =
  chain(([expr, input]) =>
    pipe(
      input,
      or([
        mapTo(symbol('*'), () => Expr.ZeroOrMore({ expr })),
        mapTo(symbol('+'), () => Expr.OneOrMore({ expr })),
        mapTo(symbol('?'), () => Expr.Optional({ expr })),
      ]),
      orElse(() => right([expr, input]))
    )
  )

export const expressionP: Parser<Expr> = (input: string) =>
  pipe(
    input,
    or([
      mapTo(delimited(symbol('('), many1(expressionP), symbol(')')), (exprs) =>
        Expr.Group({ exprs })
      ),
      nextItem,
      anyItem,
      anyString,
      anyNumber,
      anyBool,
      truthy,
      falsey,
    ]),
    wrapQuantifiers
  )

export const parser = tuple3(optional(start), many1(expressionP), optional(end))

/*

{3,6} => 3 to 6 instances
(> 5) => number greater than
(< 5) => number less than
[name x] => apply x on property `name`
| => or
/x/ => match regular expression (string values in list)

*/