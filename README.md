# ESCountArguments
Count all arguments of a function (including arguments with default values)

The native `length` method of an ES function returns the number of the function arguments, e.g. `*function(a, b) {}).length` is 2. But if the function knows arguments with default values, those are not included. So

```
function x(a, b=2, c=3) {};
console.log(x.length); // => 1;
```

This small utility library also counts the arguments with default values.

This will always be an *approximation*, good for almost all cases but it *may* not be accurate for edge cases (like very complex strings/strings within values that are Objects, function declarations as parameters etc.).

Import this library using `https://kooiinc.github.io/ESCountArguments/`

See this [Stackblitz project](https://stackblitz.com/edit/web-platform-jaxz82?file=script.js) for tests and syntax
