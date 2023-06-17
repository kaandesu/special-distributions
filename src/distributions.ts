import { Calc, noop } from './utils'
import { Prob } from './types'

class DistributionTemplate {
  id: 'Template'
  lambda: number
  constructor(lambda: number) {
    this.lambda = lambda
    this.id = 'Template'
  }

  expected() {
    noop()
  }

  variance() {
    noop()
  }

  probabilityAt() {
    noop()
  }

  calculate() {
    noop()
  }
}

export class BernoulliDistribution {
  id: string
  p: Prob

  constructor(p: Prob) {
    this.p = p
    this.id = 'Bernoulli'
  }

  public Bernoulli = (p: Prob) => {
    const random = Math.random()
    if (random <= p) return 1
    return 0
  }

  expected() {
    return this.p
  }

  calculate() {
    return this.Bernoulli(this.p)
  }

  variance() {
    return this.p * (1 - this.p)
  }

  probabilityAt() {
    return this.p
  }
}

export class BinomialDistribution {
  id: string
  n: number
  p: Prob
  sum: number = 0

  Bern: BernoulliDistribution
  constructor(n: number, p: Prob) {
    this.n = n
    this.p = p
    this.id = 'Binomial'
    this.Bern = new BernoulliDistribution(p)
  }

  private Binomial(n: number, p: Prob) {
    this.sum = 0
    for (let i = 0; i < n; i++) {
      this.sum += this.Bern.calculate()
    }
    return this.sum
  }

  expected() {
    return this.n * this.p
  }

  calculate() {
    return this.Binomial(this.n, this.p)
  }

  variance() {
    return this.n * this.p
  }

  probabilityAt = (want: number) => {
    const total = this.n
    let { comb, power } = new Calc()
    return comb(total, want) * power(this.p, want) * power(1 - this.p, total - want)
  }
}

export class PoissonDistribution {
  id: 'Poisson'
  lambda: number
  constructor(lambda: number) {
    this.lambda = lambda
    this.id = 'Poisson'
  }

  expected() {
    return this.lambda
  }

  variance() {
    return this.lambda
  }
  calculate() {
    noop()
  }
  probabilityAt = (k: number) => {
    let { power, factorial, e } = new Calc()
    return (power(e, this.lambda * -1) * power(this.lambda, k)) / factorial(k)
  }
}

export class GeometricDistribution {
  id: string
  p: Prob
  Bern: BernoulliDistribution
  constructor(p: Prob) {
    this.p = p
    this.id = 'Geometric'
    this.Bern = new BernoulliDistribution(p)
  }

  private tryUntil = async (total: number = 1) => {
    let temp = this.Bern.calculate()
    if (temp) return total
    let result: any = this.tryUntil(total + 1)
    return result
  }

  expected() {
    return 1 / this.p
  }

  variance() {
    return (1 - this.p) / this.p ** 2
  }

  probabilityAt(k: number) {
    let { power } = new Calc()
    return this.p * power(1 - this.p, k - 1)
  }

  async calculate() {
    return await this.tryUntil()
  }
}

export class NegativeBinomial {
  id: string
  n: number
  p: Prob
  constructor(n: number, p: Prob) {
    this.n = n
    this.p = p
    this.id = 'NegativeBinomial'
  }
  private Bernoulli100 = (): number => {
    const random = Math.random()
    return random <= this.p ? 1 : 0
  }

  tryUntil = async (
    want: number = 3,
    wins: number = 0,
    total: number = 0,
    times: number = 1
  ): Promise<number> => {
    const result = await this.Bernoulli100()
    wins += result
    total++

    if (result && wins === want && total === this.n) {
      return times
    } else if ((wins == want && total != this.n) || (wins != want && total == this.n)) {
      return this.tryUntil(want, 0, 0, times + 1)
    } else {
      return this.tryUntil(want, wins, total, times)
    }
  }

  expected() {
    noop()
  }

  variance() {
    noop()
  }

  async probabilityAt(r: number) {
    return await this.tryUntil(r)
  }

  async calculate() {
    let { comb, power } = new Calc()
    let n = 10
    let r = 3
    let p = 0.09
    return comb(n - 1, r - 1) * power(p, r) * power(1 - p, n - r)
  }
}
