# schrodinger

## Introduction

[Schrödinger's cat](https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat) is a thought experiment devised by Austrian physicist Erwin Schrödinger in 1935. This experiment propose to introduce a cat inside a close box with a probabilistic radiactive device that going to cause the cat's death without knowing when does the cat die. Only if someone opens the box, then they be able to know if cat is dead or alive. This micro-library does not aim to clarify anything about this paradoxical quantum experiment.

Conversely it provides a `Schrodinger` class that builds instances with undetermined value inside. This value is only determined if the user gets the value or force the value setting it. Once the user know the value, this value is unmodifiable. This library also provides a set of errors to prevent forcing the value if it has been already determined.

Therefore, `Schrodinger` is a class with a `get` and `set` methods. But `get` is not commonly getter and requires a `seed` parameter to determine which of all possible values is returned. The possible values that can return `get` method are passed through an array or a function on first parameter of constructor.

## Version
1.0.0

## Examples

#### get first:
``` javascript
var Schrodinger = require('schrodinger')
var seed = 13126

var schrodinger = new Schrodinger([10, 501, 2020], true)
schrodinger.get(seed) // resolves to 501 and returns 501
schrodinger.get(seed) // returns 501
schrodinger.get(seed) // returns 501

schrodinger.set(10) /* throws an error because `true` in second parameter of constructor, 
it forces to report an error if it is attempted to set value after this value is already 
determined. */

schrodinger.get(seed) // keeps returning 501
```

#### set first:
``` javascript
var Schrodinger = require('schrodinger')
var seed = 13126

var schrodinger = new Schrodinger(function (seed) {
    return seed * seed % 11
}, false)

schrodinger.set(5) // now value is determined to 5
schrodinger.get(seed) // returns 5 (ignoring seed)
schrodinger.get(seed) // returns 5 (ignoring seed)

schrodinger.set(7) // do nothing, value is already set.
/* it does not throw error because `false` second parameter in constructor silences all errors. */

schrodinger.get(seed) // keeps returning 5
```

## API

### constructor (values, errorConfig = true)

It builds an instance with undetermined value among `values` passed in first parameter.

#### parameters
##### values
- Type: Array | Function

##### errorConfig
- Type: Object | Boolean
- Default: `true`

It defines an object where each key with `true` value represents an error that is allowed to throw. These errors are thrown depending on order that are called `get` and `set` methods and their parameters. Also it is allowed to pass a boolean shortcut like `false` or `true`:

`false` is an alias of `{}` (it does not report errors)

`true` is an alias of the most strict option (it reports the whole errors):
``` javascript
{
    GetWithDifferentSeedError: true,
    SetAfterGetError: true,
    SetAfterSetError: true,
    SetDifferentValueError: true,
    SetInvalidValueError: true
}
```

### get (seed) : throws SchrodingerError

- If value is undetermined, a value is determined using `seed` and is returned.
- If value is determined, it returns this value or throws an error depending on `errorConfig` constructor parameter.

#### parameters
##### seed
- Type: Integer

It determines the value that returns `get` if it is called the first time.

#### errors
##### GetWithDifferentSeedError
If `errorConfig` parameter has property `GetWithDifferentSeedError` on `true` and `get` is called with different seed that `get` was called the first time, then it throws `GetWithDifferentSeedError` error.

### set (value) : throws SchrodingerError
- Depending on `errorConfig` constructor parameter, if value is undetermined it sets `value` or throws an error
- If value is determined, it does not modify it and throws error or not depending on `errorConfig`.

#### parameters
##### value
- Type: *

It is the value that is attempeted to set.

#### errors
##### SetAfterGetError
If `errorConfig` parameter has property `SetAfterGetError` on `true` and `set` is called after having previously called `get` method, then it throws `SetAfterGetError` error.

##### SetAfterSetError
If `errorConfig` parameter has property `SetAfterSetError` on `true` and `set` is called after having previously called `set` method, then it throws `SetAfterSetError` error.

##### SetDifferentValueError
If `errorConfig` parameter has not properties `SetAfterGetError` and `SetAfterSetError` but has property `SetDifferentValueError` on `true` and `set` is called with different value than it was called the first time, then it throws `SetDifferentValueError` error.

##### SetInvalidValueError
If `errorConfig` parameter has property `SetInvalidValueError` on `true`, it was passed an array of `values` on first parameter of constructor  and `set` is called with value not included in `values`, then it throws `SetInvalidValueError` error.

## WIP More Documentation
See [tests](https://github.com/xgbuils/schrodinger/tree/master/test) for more documentation.

## License
MIT
