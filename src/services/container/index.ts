class ServiceContainer {
  private container = new Map();

  add = (key: string, value: any): void => {
    const item = this.container.get('key');
    if (!item) {
      this.container.set(key, {
        key,
        value,
      });
    } else if (item && !item.singleton) {
      this.container.set(key, { ...item, value });
    }
  };

  get = <K>(key: string, defaultValue?: any): K => {
    const item = this.container.get(key);
    return (item && item.value) || defaultValue;
  };

  singleton = (key: string, value: any): void => {
    if (!this.has(key)) {
      this.container.set(key, {
        key,
        value,
        singleton: true,
      });
    }
  };

  has = (key: string): any => this.container.has(key);

  remove = (key: string): any => this.container.delete(key);

  create = (name: string): ServiceContainer => {
    this.singleton(name, new ServiceContainer());
    return this.get(name);
  };
}

export { ServiceContainer };
export default new ServiceContainer();
