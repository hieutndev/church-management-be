import type {
  Config,
  Default,
  Objectype,
  Production,
} from './config.interface';

const util = {
  isObject<T>(value: T): value is T & Objectype {
    return value != null && typeof value === 'object' && !Array.isArray(value);
  },
  merge<T extends Objectype, U extends Objectype>(target: T, source: U): T & U {
    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (this.isObject(targetValue) && this.isObject(sourceValue)) {
        Object.assign(
          sourceValue as object,
          this.merge(targetValue, sourceValue),
        );
      }
    }

    return { ...target, ...source };
  },
};

import { config as defaultConfig } from './envs/default';
import { config as developmentConfig } from './envs/development';
import { config as productionConfig } from './envs/production';

let environmentConfig: any = developmentConfig;
if (process.env.NODE_ENV === 'production') {
  environmentConfig = productionConfig;
}

export const configuration: Config = util.merge(
  defaultConfig,
  environmentConfig,
);
