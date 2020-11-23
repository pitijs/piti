interface ICommand {
  name: string;
  description: string;
  handle: () => Promise<any> | void;
}

export default ICommand;
