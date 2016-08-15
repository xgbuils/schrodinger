# schrodinger

[![travis ci][1]][2]
[![Coverage Status][3]][4]

## Version
1.0.0

## Introduction

[Schrödinger's cat](https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat) is a thought experiment devised by Austrian physicist Erwin Schrödinger in 1935. This experiment propose to introduce a cat inside a close box with a probabilistic radiactive device that going to cause the cat's death without knowing when does the cat die. Only if someone opens the box, then they be able to know if cat is dead or alive. This micro-library does not aim to clarify anything about this paradoxical quantum experiment.

Conversely it provides a `Schrodinger` class that builds instances with undetermined value inside. This value is only determined if the user gets the value or force the value setting it. Once the user know the value, this value is unmodifiable. This library also provides a set of errors to prevent forcing the value if it has been already determined.

Therefore, `Schrodinger` is a class with a `get` and `set` methods. But `get` is not commonly getter and requires a `seed` parameter to determine which of all possible values is returned.

### Instancing Schrodinger class
Firstly, when it is instanced an Schrodinger class, the value that contains is undetermined. Nevertheless, constructor of class requires a set of values to determine the value subsequently. This set of values can be passed using an array or a function with seed parameter:
``` javascript
var Schrodinger = require('schrodinger')

// passing an array:
var a = new Schrodinger([5, /\d+/, 'bar']) // it potentially determines to 5, /\d+/ or 'bar'

// passing a function:
var b = new Schrodinger(function (seed) {
    return seed * seed % 7
}) // it potentially determines to any value that function returns.
```

### Value determination
#### Determination by set method
The simplest way to determine value of Schrodinger instance is setting it using `set`method:

```
var instance = new Schrodinger([1, 3, 6, 10]) // undetermined value
instance.set(6) // from now, if it is gotten the value, it always return 6
```

Notice: set method might throw an exception [in certain circumstances](https://github.com/xgbuils/schrodinger#setinvalidvalueerror).

#### Determination by get method
If value determination is not forced by any `set` method. The first call of `get` method determine the value using a `seed`. If set of possibles values was determined using an array, the value is detetermined getting the value in `seed % values.length` position. For example:

``` javascript
var a = new Schrodinger(['apple', 'orange', 'banana'])
a.get(5) // 5 % 3 === 2 --> returns 'banana'

var b = new Schrodinger(['apple', 'orange', 'banana'])
b.get(12) // 12 % 3 === 0 --> returns 'apple'
```

If set of values is determined by a function, `get` method determines the value calling this function:

``` javascript
var a = new Schrodinger(function (seed) {
    return (seed * seed) % 7
})
a.get(5) // (5 * 5) % 7 === 4 --> returns 4
```

### Unmodifiable value after determination and throwing errors
Once value is determined, `get` method will return this value forever, and `set` method will not overwrite this value. Depending on second parameter of constructor, `get` and `set` might throw errors if it is attempted to set a value that is already determined or get the value with another seed. To know more about errors see [API documentation](https://github.com/xgbuils/schrodinger#api). 

The following example shows how Shrodinger instance keeps the value unmodified and does not throw any error because the second parameter of constructor is `false`:

``` javascript
var instance = new Schrodinger([1, 2, 4, 8, 16], false)
var seed1 = 12753
var seed2 = 843832

instance.set(4) // from now, value is determined to 4
instance.get() // returns 4
instance.get(seed1) // returns 4 (ignoring seed)
instance.set(7) // do nothing
instance.get(seed2) // returns 4 (ignoring seed)
```

## API

### constructor (values, errorConfig = true) : throws SchrodingerError

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

#### errors
##### InvalidEmptyListError
Constructor throws this error when first parameter is an empty array. It is not possible to build an Schrodinger instance with empty list of options to get.

##### InvalidParamConstructorError
Constructor throws this error when first parameter is not an array or a function.

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

###### Example
``` javascript
var Schrodinger = require('schrodinger')
var firstSeed = 9
var secondSeed = 11
var instance = new Schrodinger([2, 3, 5, 7, 11, 13], {
    GetWithDifferentSeedError: true
})

instance.get(firstSeed) // returns 7
instance.get(secondSeed) // throws GetWithDifferentSeedError
```

### set (value) : throws SchrodingerError
- If value is undetermined it sets `value` or throws an error depending on `errorConfig`.
- If value is determined, it does not modify it and throws error or not depending on `errorConfig`.

#### parameters
##### value
- Type: *

It is the value that is attempeted to set.

#### errors
##### SetAfterGetError
If `errorConfig` parameter has property `SetAfterGetError` on `true` and `set` is called after having previously called `get` method, then it throws `SetAfterGetError` error.

###### Example
``` javascript
var Schrodinger = require('schrodinger')
var seed = 9
var instance = new Schrodinger([2, 3, 5, 7, 11, 13], {
    SetAfterGetError: true
})

instance.get(seed) // returns 7
instance.set(7) // it throws a SetAfterGetError
```

##### SetAfterSetError
If `errorConfig` parameter has property `SetAfterSetError` on `true` and `set` is called after having previously called `set` method, then it throws `SetAfterSetError` error.

###### Example
``` javascript
var Schrodinger = require('schrodinger')
var seed = 9
var instance = new Schrodinger([2, 3, 5, 7, 11, 13], {
    SetAfterSetError: true
})

instance.set(5) // set 5
instance.set(5) // it throws a SetAfterSetError
```

##### SetDifferentValueError
If `errorConfig` parameter has not properties `SetAfterGetError` and `SetAfterSetError` but has property `SetDifferentValueError` on `true` and `set` is called with different value than it was called the first time, then it throws `SetDifferentValueError` error.

###### Example
``` javascript
var Schrodinger = require('schrodinger')
var seed = 9
var instance = new Schrodinger([2, 3, 5, 7, 11, 13], {
    SetDifferentValueError: true
})

instance.set(5) // set 5
instance.set(5) // it does not throws error because SetAfterSetError property is not true
instance.set(7) // it throws a SetDifferentValueError
```

##### SetInvalidValueError
If `errorConfig` parameter has property `SetInvalidValueError` on `true`, it was passed an array of `values` on first parameter of constructor  and `set` is called with value not included in `values`, then it throws `SetInvalidValueError` error.

###### Example
``` javascript
var Schrodinger = require('schrodinger')
var seed = 9
var instance = new Schrodinger([2, 3, 5, 7, 11, 13], {
    SetInvalidValueError: true
})

instance.set(8) // throws a SetInvalidValueError because 8 is not in list of possible values.
```

## WIP More Documentation
See [tests](https://github.com/xgbuils/schrodinger/tree/master/test) for more documentation.

## License
MIT

  [1]: https://travis-ci.org/xgbuils/schrodinger.svg?branch=master
  [2]: https://travis-ci.org/xgbuils/schrodinger
  [3]: https://codecov.io/gh/xgbuils/schrodinger/branch/master/graph/badge.svg
  [4]: https://codecov.io/gh/xgbuils/schrodinger
