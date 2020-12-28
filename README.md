[![Build Status](https://travis-ci.org/ovanderzee/inactivity-listener.svg?branch=main)](https://travis-ci.com/ovanderzee/inactivity-listener)
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

## Install

Install the package as npm package. Provided are
a umd-formatted file in the dist folder to require or just read
and an es-module in the module folder to import.

## Usage

Start watching activity, waiting for inactivity.

```
let interval = 120000 // 20 minutes
let callback = function () {
    toDoWhenInactive()
    inactivityListener.restart()
}
inactivityListener.start(interval, callback)
```

Reset timer when ticking:

```
inactivityListener.reset()
```

Report inactivity, in milliseconds:

```
let inactiveTime = inactivityListener.lapse
```

Resume listening after timeout:

```
inactivityListener.restart()
```

Remove listeners, clear timer:

```
inactivityListener.stop()
```

## Demo

.../inactivity-listener/demo/inactivityListener.html
