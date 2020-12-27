# Piti

[![npm version](https://badge.fury.io/js/piti.svg)](https://badge.fury.io/js/piti)

**Piti** is a small cli framework developed with Typescript. You can develop reactive applications by [Redux](https://redux.js.org/) and [RxJS](https://www.learnrxjs.io/) in Piti.

**Install**

```sh
$ yarn add piti
```

or

```sh
$ npm i piti --save
```

## Quick Start

**hello.ts**

```ts
import { Command } from 'piti';

@Command()
class HelloCommand {
  name = 'hello';
  description = 'The hello world command';

  handle() {
    console.log('Hello World!');
  }
}

export default HelloCommand;
```

**index.ts**

```ts
import Piti from 'piti';
import './hello';

Piti.run({
  scriptName: 'console-app',
});
```

**Terminal**

```sh
$ npx ts-node index.ts hello
```

## Command arguments

Piti uses [yargs](http://yargs.js.org/) for command arguments. Created command builder will be inject to command class constructor. So you can be detail your command arguments.

**Example:**

```ts
import { Command } from 'piti';
import { Argv, Arguments } from 'yargs';

@Command()
class LoginCommand {
  name = 'login';
  description = 'Loging to platformm';

  before(builder: Argv) {
    builder
      .positional('username', {
        type: 'string',
        describe: 'The user name',
      })
      .positional('password', {
        type: 'string',
        describe: 'The user password',
      });
  }

  handle(args: Arguments) {
    console.log('username:', args.username, 'password:', args.password);
  }
}

export default LoginCommand;
```

**Terminal**

```sh
$ npx ts-node index.ts login --username test@example.com --password 1234
```

For more advanced usage, please visit: http://yargs.js.org

## Dependency Injection

With the `@Command` decorator you can inject parameters into the command class constructor.

```ts
@Command({
  inject: [auth, user],
})
class LoginCommand {
  constructor(auth, user) {
    // ...
  }
}
```

## Use Redux

You can manage state of objects using pure ReduxJS library. For this first of all, you should be configure the redux then pass the store to Piti.

**Install Redux:**

```sh
$ yarn add redux
```

**Create store:**

```ts
import Piti from 'piti';
import { createStore } from 'redux';

const store = createStore(reducers);

Piti.run({
  scriptName: 'console-app',
  store,
});
```

That's all.

### Actions and Subscribers

**Action creator**

```ts
const fetchUser = (email: string) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_USER_PENDING' });
    const result = await fetch(/**api request**/);
    dispatch({ type: 'FETCH_USER_FULFILLED', data: result });
  } catch (e) {
    dispatch({ type: 'FETCH_USER_REJECTED', error: e });
  }
};
```

**Reducer**

```ts
const initialState = {
  pending: false,
  error: null,
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_USER_PENDING': {
      return {
        ...state,
        pending: true,
      };
    },
    case 'FETCH_USER_FULFILLED': {
      return {
        ...state,
        pending: false,
        user: action.data
      }
    },
    case 'FETCH_USER_REJECTED': {
      return {
        error: action.error,
        pending: false,
        user: null,
      }
    }
    default:
      return state;
  }
};
```

**Command**

```ts
import { Command, Subscribe, dispatch, getState } from 'piti';

@Command()
class CreateUserCommand {
  name = 'create-user [email]';
  description = 'Create a new user';
  args = {};

  @Subscribe('FETCH_USER_FULFILLED')
  userAlreadyExists() {
    console.log('The user already created!');
  }

  @Subscribe('FETCH_USER_REJECTED')
  fetchUserRejected() {
    const { user } = getState();
    if (user.error.message === 'user not found') {
      this.createNewUser();
    }
  }

  @Subscribe('CREATE_USER_FULFILLED')
  createUserFulfilled() {
    console.log('User created!');
  }

  createNewUser() {
    const { email } = this.args;
    dispatch(createUser(email));
  }

  handle(args: Arguments) {
    this.args = args;
    dispatch(fetchUser(args.email));
  }
}
```

**Terminal**

```sh
$ npx ts-node index.ts create-user test@example.com
```

### RxJS Operators

```ts
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Command()
class CreateUserCommand {
  name = 'fetch-users';
  description = 'Fetch users and filter vip ones';

  @Subscribe({
    action: 'FETCH_USERS_FULFILLED',
    observer(subject: Subject<any>): Observable<any> {
      return subject.pipe(filter((user) => user.isVip));
    },
  })
  fetchUsersFulfilled(result) {
    console.log(result);
    // [{name: 'Thor', isVip: true}]
  }

  handle() {
    dispatch(fetchUsers());
  }
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
