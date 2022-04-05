import {
  ma
} from 'moving-averages'


export default (data, size) => {
  const length = data.length
  const avg = ma(data, size)
  const ret = []

  let i = size - 1
  let j
  let sum

  for (; i < length; i ++) {
    sum = 0
    j = i - size + 1

    for (; j <= i; j ++) {
      sum += Math.pow(data[j] - avg[i], 2)
    }

    ret[i] = Math.sqrt(sum / size)
  }

  return ret
}
