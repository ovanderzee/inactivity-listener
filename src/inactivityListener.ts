const inactivityListener = (function () {
    // configurable time until callback is executed - Number in milliseconds
    let timeLimit: number
    // configurable function to execute after timeLimit passed - Function
    let callback: Function
    // generated id for inactivity span - Number
    let timeoutId: number
    // generated timestamp for start or last activity - Date object
    let timeRoot: Date
    // internal events to listen to - String[]
    let eventTypes: string[]
    // default events to listen to - String[]
    let standardEventTypes: string[] = [
        'keydown',
        'keyup', // to be sure
        'mousemove',
        'mouseenter', // to be sure
        'mousedown',
        'mouseup', // to be sure
        'scroll',
        'wheel',
    ]
    // internal state; one of 'void', 'busy' or 'lapse' - String
    let state: string = 'void'

    /**
     * Calculate lapsed timeout
     * @return {Number} milliseconds after start
     */
    const elapsed = function (): number {
        const passed = new Date() - timeRoot
        return passed
    }

    /**
     * Execute callback when time is up
     * @private
     */
    const execute = function (): void {
        state = 'lapse'
        try {
            callback()
        } catch (error) {
            console.error('inactivityListener executed a erroneous callback')
        }
    }

    /**
     * Put up a new round of waiting
     * @private
     */
    const watch = function (): void {
        state = 'busy'
        timeRoot = new Date()
        if (timeoutId !== undefined) ignore()
        timeoutId = setTimeout(execute, timeLimit)
    }

    /**
     * Terminate the timeout
     * @private
     */
    const ignore = function (): void {
        clearTimeout(timeoutId)
        timeoutId = undefined
    }

    /**
     * Reset critical values
     * and start waiting again.
     * Works when the timeout is set
     */
    const reset = function (): void {
        // only when timeout is set
        if (state !== 'busy') return
        ignore()
        watch()
    }

    /**
     * Start waiting with same timelimit and callback
     * Works when the timeout is completed
     */
    const restart = function (): void {
        // not when untouched or timing
        if (state !== 'lapse') return
        watch()
    }

    /**
     * Add or remove EventListeners
     * @private
     * @param {String} aim - 'add' | 'remove'
     */
    const eventHandling = function (aim: string): void {
        // event options
        const eventOptions = { passive: true, capture: true }
        let count = 0

        eventTypes.forEach(function (type: string): void {
            const handler = `on${type}`
            if (handler in window) {
                window[aim + 'EventListener'](type, reset, eventOptions)
                count++
            } else if (handler in document) {
                document[aim + 'EventListener'](type, reset, eventOptions)
                count++
            } else if (aim === 'add') {
                console.warn(`inactivityListener rejected ${type}-event`)
            }
        })

        if (!count && aim === 'add') {
            console.warn(`inactivityListener resets only on coded calls!`)
        }
    }

    /**
     * Bring in variables, start listeners and timer.
     * @param {Number} waitTime - time in milliseconds
     * @param {Function} action - callback
     * @param {String[]} eventNames - new list of events to watch
     */
    const start = function (waitTime: number, action: Function, eventNames: string[]): void {
        timeLimit = waitTime
        callback = action
        eventTypes = standardEventTypes
        if (Array.isArray(eventNames) && eventNames.length) {
            eventTypes = eventNames.join().toLowerCase().split(',')
        }
        if (state === 'void') {
            eventHandling('add')
        }
        watch()
    }

    /**
     * Cleanup for single page apps
     */
    const stop = function (): void {
        state = 'void'
        ignore()
        eventHandling('remove')
    }

    return {
        start: start,
        reset: reset,
        get lapse() {
            return elapsed()
        },
        restart: restart,
        stop: stop,
    }
})()

export { inactivityListener }
