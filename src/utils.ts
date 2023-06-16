import { Distributions } from './types'

export const noop = () => {}

export const log = async (dist: Distributions, probAt?: number) =>
  console.log(dist.id, {
    value: (await dist.calculate()) ?? '',
    expected: dist.expected(),
    variance: dist.variance(),
    probabilityAt: probAt ? String(probAt) + ': ' + dist.probabilityAt(probAt) : '',
  })

export class Calc {
  factorial = (n: number) => {
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
  }
  power = (base: number, exponent: number): number => {
    return Math.pow(base, exponent)
  }

  comb = (n: number, k: number): number => {
    return this.factorial(n) / (this.factorial(k) * this.factorial(n - k))
  }
  e = Math.exp(1)
}

// const { factorial, power, comb } = new Calc()
// console.log(comb(4, 2) * power(1 / 3, 2) * power(2 / 3, 2), factorial(5))
