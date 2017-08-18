# Virtual Dom

> Because everybody's doing it.

## Example

```js
const hello1 = [
  h('div', null, 'Hello, world');
];
appendChildren(document.body, hello1);

const hello2 = [
  h('div', null, 'Hello, you');
];
updateChildren(document.body, hello2, hello1);
```

## Legal

The MIT License © 2017 Arthur Corenzan.
