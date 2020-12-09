[![Build Status](https://travis-ci.com/ovanderzee/inactivity-listener.svg?branch=master)](https://travis-ci.com/ovanderzee/inactivity-listener)
[![Coverage Status](https://coveralls.io/repos/github/ovanderzee/inactivity-listener/badge.svg?branch=master)](https://coveralls.io/github/ovanderzee/inactivity-listener?branch=master)

# Inactivity Listener

Do something when a timespan of no interaction passes.
Straightforward;
It sets a timeout that can be reset by internal eventListeners -
or through the public API.
When time passes your callback is executed.
A subsequent timeout can be set manually.
The total inactive time can be obtained.

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
inactivityListener.start(waitTime, callback)
```

Reset timer when ticking:

```
inactivityListener.reset()
```

Resume listening after timeout, report inactivity:

```
let inactiveTime = inactivityListener.restart()
```

Stop listening, cancel timer:

```
inactivityListener.destroy()
```
