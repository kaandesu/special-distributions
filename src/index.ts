import { log } from './utils'
import {
  BinomialDistribution,
  BernoulliDistribution,
  PoissonDistribution,
  GeometricDistribution,
} from './distributions'

log(new BernoulliDistribution(0.5))

log(new BinomialDistribution(4, 1 / 3), 2)

log(new PoissonDistribution(5), 4)

log(new GeometricDistribution(0.5))
