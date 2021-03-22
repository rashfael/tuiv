# Commands



## Page

Enhances playwrights [Page](https://playwright.dev/docs/api/class-page):

### get

Alias for `waitForSelector`, returns an [Element](#element)

### getAll

Alias for `waitForSelector` + `$$`, returns an [ElementList](#elementlist)

### wait

Alias for `waitForTimeout`.

### evaluate

Enhances `evaluate` with `JSON.stringify` replacer, returns a [Value](#value)

## Frame

Enhances playwrights [Frame](https://playwright.dev/docs/api/class-page) with methods from tuiv [Page](#page).

## Element

If not otherwise specified, all calls return the same [Element](#element) again.

### should

### find

Alias for `waitForSelector`, returns a new [Element](#element)

### findAll

Alias for `waitForSelector` + `$$`, returns a new [ElementList](#elementlist)

### clear

Alias for `fill('')`

### type

Enhances playwright `type`, supports keypress syntax: `type('press {Shift+Control+Delete}{Enter}')`

### boundingBox

Returns a [Value](#value)

### closest

Wraps native [closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest), returns an [Element](#element)

### contentFrame

Returns a [Frame](#frame)



## ElementList

### should

### [Number]

### first

### last

### forEach

## Value
