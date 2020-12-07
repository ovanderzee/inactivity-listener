const inactivityListener = (function() {
    // time until callback is executed - Number in milliseconds
    let timeLimit
    // to execute after timeLimit passed - Function
    let callback
    // id for inactivity span - generated
    let timeoutId
    // timestamp of start or last activity - Date object
    let timeRoot
    // to what events to listen
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

    /**
     * Calculate lapsed timeout
     * @private
     * @return {Number} milliseconds after start
     */
    const timeLapse = function() {
        const past = new Date() - timeRoot
        return past
    }

    /**
     * Execute callback when time is up
     * @private
     */
    const execute = function() {
        timeoutId = undefined
        callback()
    }

    /**
     * Put up a new round of waiting
     * @private
     */
    const wait = function() {
        timeoutId = setTimeout(execute, timeLimit)
    }

    /**
     * Terminate the timeout
     * @private
     */
    const stop = function() {
        clearTimeout(timeoutId)
    }

    /**
     * Reset critical values
     * and start waiting again.
     * Works when the timeout is set
     */
    const reset = function() {
        // only when timeout is set
        if (!timeoutId) return
        stop()
        timeRoot = new Date()
        wait()
    }

    /**
     * Start waiting with same timelimit and callback
     * Works when the timeout is completed
     * @return {Number} milliseconds after start
     */
    const restart = function() {
        // not when timeout is set
        if (timeoutId) return
        // not when functionality is untouched
        if (!timeLimit || !callback) return
        const past = timeLapse()
        timeRoot = new Date()
        wait()
        return past
    }

    /**
     * Add or remove EventListeners
     * @private
     * @param {String} aim - 'add' | 'remove'
     */
    const eventHandling = function(aim) {
        // event options
        const eventOptions = { passive: true, capture: true }

        eventTypes.forEach(function(type) {
            const handler = `on${type}`
            if (handler in window) {
                window[aim + 'EventListener'](type, reset, eventOptions)
            } else if (handler in window) {
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
    const start = function(waitTime, action) {
        timeLimit = waitTime
        callback = action
        eventHandling('add')
        wait()
    }

    /**
     * Cleanup for singe page apps
     * @private
     */
    const destroy = function() {
        stop()
        eventHandling('remove')
    }

    return {
        start: start,
        reset: reset,
        restart: restart,
        destroy: destroy,
    }
})()

export { inactivityListener }
