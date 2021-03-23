# Assertions

Assertions take the form of

```js
should.SUBJECT[(SUBJECT_ARG)][.not][.VERB][(VERB_ARG)]
```
or in the case of boolean subjects:

```js
should[.not][.be].SUBJECT[(SUBJECT_ARG)]
```

with an arbitrary amount of filler words in between.

## Subjects

### text

Extracts the `textContent` from the subject element using playwrights [textContent](https://playwright.dev/docs/api/class-elementhandle#elementhandletextcontent)

```js
await element.should.have.text('someText')
```


### class

Extracts the `classList` from the subject element

```js
await element.should.have.class('some-class')
```

### empty

Checks if subject element matches [:empty](https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled) selector

```js
await element.should.be.empty
```

### disabled

Checks if subject element matches [:disabled](https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled) selector

```js
await element.should.be.disabled
```

### length
### value

Extracts the `value` property of the subject element.
This is **different** from `attr('value')`, which only extracts the initial value.

```js
await element.should.have.value('someValue')
```


### keys
### attr

Extracts an attribute from the subject element using playwrights [getAttribute](https://playwright.dev/docs/api/class-elementhandle#elementhandlegetattributename)

```js
await element.should.have.attribute('some-attribute').equaling('someValue')
```

## Verbs

### equals
Alias `equal`, `equaling`

### contains
Alias `contain`, `containing`

### includes
Alias `include`, `including`

### exist
Alias `exists`, `existing`
