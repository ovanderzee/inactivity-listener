const inactivityListener = (function () {
    // time until callback is executed - Number in milliseconds
    let timeLimit
    // to execute after timeLimit passed - Function
    let callback
    // generated id for inactivity span - Number
    let timeoutId
    // timestamp of start or last activity - Date object
    let timeRoot
    // to what events to listen - String[]
    let eventTypes = [
        'keydown',
        'keyup', // to be sure
        'mousemove',
        'mouseenter', // to be sure
        'mousedown',
        'mouseup', // to be sure
        'scroll',
        'wheel',
    ]
    // void, busy, lapse
    let state = 'void'

    /**
     * Calculate lapsed timeout
     * @return {Number} milliseconds after start
     */
    const elapsed = function () {
        const past = new Date() - timeRoot
        return past
    }

    /**
     * Execute callback when time is up
     * @private
     */
    const execute = function () {
        state = 'lapse'
        try {
            callback()
        } catch (error) {
            console.error('faulty callback')
        }
    }

    /**
     * Put up a new round of waiting
     * @private
     */
    const watch = function () {
        state = 'busy'
        timeRoot = new Date()
        timeoutId = setTimeout(execute, timeLimit)
    }

    /**
     * Terminate the timeout
     * @private
     */
    const stop = function () {
        clearTimeout(timeoutId)
    }

    /**
     * Reset critical values
     * and start waiting again.
     * Works when the timeout is set
     */
    const reset = function () {
        // only when timeout is set
        if (state !== 'busy') return
        stop()
        watch()
    }

    /**
     * Start waiting with same timelimit and callback
     * Works when the timeout is completed
     */
    const restart = function () {
        // not when untouched or timing
        if (state !== 'lapse') return
        watch()
    }

    /**
     * Add or remove EventListeners
     * @private
     * @param {String} aim - 'add' | 'remove'
     */
    const eventHandling = function (aim) {
        // event options
        const eventOptions = { passive: true, capture: true }

        eventTypes.forEach(function (type) {
            const handler = `on${type}`
            if (handler in window) {
                window[aim + 'EventListener'](type, reset, eventOptions)
            } else if (handler in document) {
                document[aim + 'EventListener'](type, reset, eventOptions)
            } else {
                console.error(`inactivityListener rejected ${type} event`)
            }
        })
    }

    /**
     * Find the id's, even when the box was changed
     * @param {Number} waitTime - time in milliseconds
     * @param {Function} action - callback
     */
    const start = function (waitTime, action) {
        timeLimit = waitTime
        callback = action
        eventHandling('add')
        watch()
    }

    /**
     * Cleanup for singe page apps
     */
    const destroy = function () {
        state = 'void'
        stop()
        eventHandling('remove')
    }

    return {
        start: start,
        reset: reset,
        get lapse() {
            return elapsed()
        },
        restart: restart,
        destroy: destroy,
    }
})()

export { inactivityListener }
