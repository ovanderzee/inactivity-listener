[![CircleCI](https://circleci.com/gh/ovanderzee/inactivity-listener/tree/main.svg?style=svg)](https://circleci.com/gh/ovanderzee/inactivity-listener/?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/ovanderzee/inactivity-listener/badge.svg?branch=main)](https://coveralls.io/github/ovanderzee/inactivity-listener?branch=main)

# Inactivity Listener

Do something when a timespan of no interaction passes.
Straightforward;
It sets a timeout that can be reset by internal eventListeners -
or through the public API.
When time passes your callback is executed.

## Features

* No permission needed unlike in Chrome's IdleDetector.
* EventListeners deal with common stopPropagation uses.
* After timeout, a next timeout with the same parameters can be set.
* Time passed since last activity available before and after timeout,
until a (re)start.
* Event types causing a reset are configurable.
* Typescript

## Install

Install the package as npm package. Provided are
a umd-formatted file in the dist folder to require or just read
and an es-module in the module folder to import.

## Usage

Start watching activity, waiting for inactivity.
optional replace standard events to watch:

```js
let interval = 120000 // 20 minutes
let callback = function () {
    if (window.alert('Ready to resume?')) {
        inactivityListener.restart()
    }
}
let events = ['touchstart', 'pointerdown']
inactivityListener.start(interval, callback[, events])
```

Reset timer when ticking:

```js
inactivityListener.reset()
```

Report inactivity, in milliseconds:

```js
let inactiveTime = inactivityListener.lapse
```

Resume listening after timeout:

```js
inactivityListener.restart()
```

Remove listeners, clear timer:

```js
inactivityListener.stop()
```

## Demo

.../inactivity-listener/demo/inactivityListener.html
