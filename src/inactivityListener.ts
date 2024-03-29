import { standardEventTypes } from './constants'

const inactivityListener = (function () {
    // configurable time until callback is executed - Number in milliseconds
    let timeLimit: number
    // configurable function to execute after timeLimit passed - Function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let callback: () => any
    // generated id for inactivity span - Number
    let timeoutId: number = Number.NaN
    // generated timestamp for start or last activity - Date object
    let timeRoot: Date
    // internal events to listen to - String[]
    let eventTypes: string[]
    // default events to listen to - String[]
    // const standardEventTypes: string[] = [
    // internal state; one of 'UNSET', 'TIMING' or 'OVERTIME' - String
    let state = 'UNSET'

    /**
     * Calculate time lapsed since setting timeout
     * @return {Number} milliseconds after start
     */
    const elapsed = function (): number {
        const now = new Date()
        const passed = now.getTime() - timeRoot.getTime()
        return passed
    }

    /**
     * Execute callback when time is up
     * @private
     */
    const execute = function (): void {
        state = 'OVERTIME'
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
        state = 'TIMING'
        timeRoot = new Date()
        if (!Number.isNaN(timeoutId)) ignore()
        timeoutId = window.setTimeout(execute, timeLimit)
    }

    /**
     * Terminate the timeout
     * @private
     */
    const ignore = function (): void {
        clearTimeout(timeoutId)
        timeoutId = Number.NaN
    }

    /**
     * Reset critical values
     * and start waiting again.
     * Works when the timeout is set
     */
    const reset = function (): void {
        // only when timeout is set
        if (state !== 'TIMING') return
        ignore()
        watch()
    }

    /**
     * Start waiting with same timelimit and callback
     * Works when the timeout is completed
     */
    const restart = function (): void {
        // not when untouched or busy
        if (state !== 'OVERTIME') return
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
                const binder = aim === 'add' ? window.addEventListener : window.removeEventListener
                binder(type, reset, eventOptions)
                count++
            } else if (handler in document) {
                const binder =
                    aim === 'add' ? document.addEventListener : document.removeEventListener
                binder(type, reset, eventOptions)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const start = function (waitTime: number, action: () => any, eventNames: string[] = []): void {
        if (state !== 'UNSET') return
        timeLimit = waitTime
        callback = action
        eventTypes = standardEventTypes
        if (eventNames.length) {
            eventTypes = eventNames.map((name) => name.toLowerCase())
        }
        eventHandling('add')
        watch()
    }

    /**
     * Cleanup for single page apps
     */
    const stop = function (): void {
        state = 'UNSET'
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
