import { Calc, noop } from './utils'
import { Prob } from './types'

class DistributionTemplate {
  id: 'Poisson'
  lambda: number
  constructor(lambda: number) {
    this.lambda = lambda
    this.id = 'Poisson'
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

  private tryUntil = async (total: number = 1, final: number = 0) => {
    let temp = this.Bern.calculate()
    if (temp) return (final = total)
    let result: any = this.tryUntil(total + 1, (final = total))
    return result
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

  async calculate() {
    return await this.tryUntil()
  }
}
