import chalk from 'chalk';

const Message = {
  error: (msg: string) => console.log(chalk.red(msg)),
  success: (msg: string) => console.log(chalk.greenBright(msg)),
  warning: (msg: string) => console.log(chalk.yellow(msg)),
  info: (msg: string) => console.log(chalk.blueBright(msg)),
};

export default Message;
