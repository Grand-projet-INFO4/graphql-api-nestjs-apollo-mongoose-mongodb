/**
 * Checks if an ENV value is in production
 *
 * @param env The environment value from the environment varibales
 */
export function isProductionEnvironment(env?: string) {
  return typeof env !== 'undefined' && env === 'PRODUCTION';
}
