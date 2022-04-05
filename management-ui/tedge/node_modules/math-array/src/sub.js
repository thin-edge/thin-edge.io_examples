import {
  orderAware
} from './utils'


const sub = (a, b) => a - b

export default (a, b, n) => orderAware(a, b, sub, n)
