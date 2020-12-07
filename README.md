[![Build Status](https://travis-ci.com/ovanderzee/inactivity-listener.svg?branch=master)](https://travis-ci.com/ovanderzee/inactivity-listener)
[![Coverage Status](https://coveralls.io/repos/github/ovanderzee/inactivity-listener/badge.svg?branch=master)](https://coveralls.io/github/ovanderzee/inactivity-listener?branch=master)

# Inactivity Listener

Do something when a timespan of no interaction passes.
Straightfoward; it sets a timeout that can be reset by internal eventListeners -
or through the public API.

## Features

* No permission needed unlike in Chrome's IdleDetector.
* EventListeners deal with common stopPropagation uses.

## Install

Install the package as npm package. Provided are
a umd-formatted file in the dist folder to require or just read
and an es-module in the module folder to import.

## Usage

Start listening:

```
const config = {
    events: <String>[],
    timespan: <Number>,
	callback: <Function>,
}
inactivityListener.start(config)
```

Reset timer:

```
inactivityListener.reset()
```

Stop listening:

```
inactivityListener.destroy()
```
