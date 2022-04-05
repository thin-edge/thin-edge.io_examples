import {
  orderUnaware
} from './utils'


const add = (a, b) => a + b
const addReverse = (a, b) => b + a

export default (a, b, n) =>
  orderUnaware(a, b, add, addReverse, n)
