import { Argv } from "yargs";

interface ICommand {
  name: string;
  description: string;
  before?: (builder: Argv) => void;
  handle: () => Promise<any> | void;
}

export default ICommand;
