export type CommandBlueprint = {
  name: string;
  description: string;
};

export type CommandDecorator = {
  inject?: any[],
  name: string;
  description: string;
};
