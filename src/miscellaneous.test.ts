import { inactivityListener } from '../src/inactivityListener'
import { StartArgs } from './types'
import { standardEventTypes } from '../src/constants'

describe('Miscellaneous highlights', function () {
    let args: StartArgs
    const eventTypeCount = standardEventTypes.length
    const timeoutCount = 1

    beforeAll(() => {
        args = {
            timeLimit: 500,
            callback: function () {
                console.log('Time is up!')
            },
        }
    })

    afterEach(() => {
        // destroy every spy
        jest.restoreAllMocks()
    })

    describe('To prevent memoryleaks it', function () {
        afterEach(() => inactivityListener.stop())

        test('should not add duplicate eventListeners or timeouts', () => {
            jest.useFakeTimers({
                legacyFakeTimers: true,
            })
            const spyEventListener = jest.spyOn(window, 'addEventListener')
            const spySetTimeout = jest.spyOn(window, 'setTimeout')
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')

            inactivityListener.start(args.timeLimit, args.callback)
            jest.advanceTimersByTime(args.timeLimit * 0.25)

            expect(spyEventListener).toHaveBeenCalledTimes(eventTypeCount)
            expect(spySetTimeout).toHaveBeenCalledTimes(timeoutCount)
            expect(spyClearTimeout).toHaveBeenCalledTimes(0)

            inactivityListener.start(args.timeLimit, args.callback)
            jest.advanceTimersByTime(args.timeLimit * 0.25)

            // no additional listeners
            expect(spyEventListener).toHaveBeenCalledTimes(eventTypeCount)
            // a cleared and set timer
            expect(spySetTimeout).toHaveBeenCalledTimes(timeoutCount * 2)
            expect(spyClearTimeout).toHaveBeenCalledTimes(timeoutCount)

            jest.runAllTimers()
        })
    })

    describe('A faulty callback', function () {
        beforeAll(() => {
            args.callback = function () {
                throw 'An error should be thrown!'
            }
        })

        afterEach(() => inactivityListener.stop())

        test('should not produce an error', () => {
            jest.useRealTimers()
            args.callback = function () {
                throw 'An error should be thrown!'
            }

            expect(args.callback).toThrow()
            expect(function () {
                inactivityListener.start(args.timeLimit, args.callback)
            }).not.toThrow()
        })

        test('should produce an error message in the console', () => {
            jest.useFakeTimers()
            const spyFaultyCallback = jest.spyOn(args, 'callback')
            const spyConsoleError = jest.spyOn(console, 'error')

            inactivityListener.start(args.timeLimit, args.callback)
            jest.runAllTimers()

            expect(spyFaultyCallback).toHaveBeenCalledTimes(1)
            expect(spyConsoleError).toHaveBeenCalledTimes(1)
        })
    })

    describe('Configurable events to listen to', function () {
        test('should be known in the window or document', () => {
            const spyAddition = jest.spyOn(window, 'addEventListener')
            const spyRemoval = jest.spyOn(window, 'removeEventListener')
            const spyConsoleWarn = jest.spyOn(console, 'warn')
            const realEvents = ['click', 'scroll']

            inactivityListener.start(args.timeLimit, args.callback, realEvents)

            expect(spyAddition).toHaveBeenCalledTimes(2)
            expect(spyConsoleWarn).toHaveBeenCalledTimes(0)

            inactivityListener.stop()

            expect(spyRemoval).toHaveBeenCalledTimes(2)
        })

        test('should show a console.warn when an event is unknown', () => {
            const spyAddition = jest.spyOn(window, 'addEventListener')
            const spyRemoval = jest.spyOn(window, 'removeEventListener')
            const spyConsoleWarn = jest.spyOn(console, 'warn')
            const mixedEvents = ['unknown', 'click']

            inactivityListener.start(args.timeLimit, args.callback, mixedEvents)

            expect(spyAddition).toHaveBeenCalledTimes(1)
            expect(spyConsoleWarn).toHaveBeenCalledWith(`inactivityListener rejected unknown-event`)

            inactivityListener.stop()

            expect(spyRemoval).toHaveBeenCalledTimes(1)
        })

        test(`should show a console.warn when no useable events are passed`, () => {
            const spyAddition = jest.spyOn(window, 'addEventListener')
            const spyRemoval = jest.spyOn(window, 'removeEventListener')
            const spyConsoleWarn = jest.spyOn(console, 'warn')
            const noEvents = ['unknown', 'useless']

            inactivityListener.start(args.timeLimit, args.callback, noEvents)

            expect(spyAddition).toHaveBeenCalledTimes(0)
            expect(spyConsoleWarn).toHaveBeenCalledWith(`inactivityListener rejected unknown-event`)

            expect(spyConsoleWarn).toHaveBeenCalledWith(`inactivityListener rejected useless-event`)

            expect(spyConsoleWarn).toHaveBeenCalledWith(`inactivityListener resets only on coded calls!`)

            inactivityListener.stop()

            expect(spyRemoval).toHaveBeenCalledTimes(0)
        })
    })
})
