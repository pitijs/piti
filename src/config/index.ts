import get from '@util-funcs/object-get';

const config = {
  containerKeys: {
    subscribersKey: 'fw.subscribers',
    scriptNameKey: 'fx.scriptName'
  },
};

type C = typeof config;

const getter = <K extends keyof C>(key: K): C[K] => get(key, config);

export default getter;
