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
  private Bernoulli100 = () => {
    const random = Math.floor(Math.random() * 100)
    if (random <= this.p * 100) return 1
    return 0
  }

  private tryUntil = async (total: number = 1, wins: number = 0, want: number = 3) => {
    let temp = this.Bernoulli100()
    let result: any = 0
    if (temp && wins === want) {
      return total
    }
    result = this.tryUntil(total + 1, temp ? wins + 1 : wins)
    return result
  }

  expected() {
    noop()
  }

  variance() {
    noop()
  }

  async probabilityAt(r: number) {
    return await this.tryUntil(1, 0, r)
  }

  async calculate() {
    noop()
    // let { comb, power } = new Calc()
    // let n = this.n
    // let p = this.p
    // return comb(n - 1, r - 1) * power(p, r) * power(1 - p, n - r)
  }
}
