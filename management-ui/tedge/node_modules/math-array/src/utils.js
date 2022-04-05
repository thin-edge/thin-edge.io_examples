export const error = (
  message
  // code
) => {
  const e = new Error(message)

  // if (code) {
  //   e.code = code
  // }

  throw e
}


const manipulate2Array = (a, b, mutator) => {
  if (a.length !== b.length) {
    error('the length of arrays not match')
  }

  return a.map((x, i) => mutator(x, b[i]))
}


const manipulateArray = (a, b, mutator) => {
  return a.map(x => mutator(x, b))
}


const isArray = (a, b) => [a, b].map(Array.isArray)

const cleanArray = (array) => {
  array.forEach((item, i) => {
    if (item !== item) {
      delete array[i]
    }
  })
}

export const orderUnaware = (
  a, b, mutator, mutatorReverse,
  ensureNumber
) => {
  const [A, B] = isArray(a, b)

  const ret = A
    ? B
      ? manipulate2Array(a, b, mutator)
      : manipulateArray(a, b, mutator)
    : B
      ? manipulateArray(b, a, mutatorReverse)
      : error('at least one array is required')

  if (ensureNumber) {
    cleanArray(ret)
  }

  return ret
}


export const orderAware = (
  a, b, mutator,
  ensureNumber
) => {
  const [A, B] = isArray(a, b)

  const ret = A
    ? B
      ? manipulate2Array(a, b, mutator)
      : manipulateArray(a, b, mutator)
    : error('the first argument must be an array')

  if (ensureNumber) {
    cleanArray(ret)
  }

  return ret
}
