import {
  BernoulliDistribution,
  BinomialDistribution,
  GeometricDistribution,
  PoissonDistribution,
  NegativeBinomial,
} from './distributions'
export type Prob = number
export type Distributions =
  | BernoulliDistribution
  | BinomialDistribution
  | PoissonDistribution
  | GeometricDistribution
  | NegativeBinomial
