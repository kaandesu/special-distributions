import {
  BernoulliDistribution,
  BinomialDistribution,
  GeometricDistribution,
  PoissonDistribution,
} from './distributions'
export type Prob = number
export type Distributions =
  | BernoulliDistribution
  | BinomialDistribution
  | PoissonDistribution
  | GeometricDistribution
