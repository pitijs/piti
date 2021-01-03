import { Argv } from "yargs";

interface ICommand {
  name: string;
  description: string;
  builder?: (builder: Argv) => void;
  handler: () => Promise<any> | void;
}

export default ICommand;
