import { execSync } from 'child_process';

export const clear = () => {
  execSync('printf "\\ec"', { stdio: 'inherit' });
};

export const newLine = (count: number = 1) => {
  console.log('\n'.repeat(count));
};
