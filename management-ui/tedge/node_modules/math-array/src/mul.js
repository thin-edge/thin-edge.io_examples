import {
  orderUnaware
} from './utils'


const mul = (a, b) => a * b

export default (a, b, n) => orderUnaware(a, b, mul, mul, n)
