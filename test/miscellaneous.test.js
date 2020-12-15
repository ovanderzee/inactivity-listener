import { inactivityListener } from '../src/inactivityListener'

describe('Miscellaneous highlights', function () {
    let args
    let eventTypeCount = 8
    let timeoutCount = 1

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
        afterEach(() => inactivityListener.destroy())

        test('should not add duplicate eventListeners or timeouts', () => {
            jest.useFakeTimers()
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
            args.faultyCallback = function () {
                throw 'An error should be thrown!'
            }
        })
        afterEach(() => inactivityListener.destroy())

        test('should not produce an error', () => {
            jest.useRealTimers()
            args.faultyCallback = function () {
                throw 'An error should be thrown!'
            }

            expect(args.faultyCallback).toThrow()
            expect(function () {
                inactivityListener.start(args.timeLimit, args.faultyCallback)
            }).not.toThrow()
        })

        test('should produce an error message in the console', () => {
            jest.useFakeTimers()
            const spyFaultyCallback = jest.spyOn(args, 'faultyCallback')
            const spyConsoleError = jest.spyOn(console, 'error')

            inactivityListener.start(args.timeLimit, args.faultyCallback)
            jest.runAllTimers()

            expect(spyFaultyCallback).toHaveBeenCalledTimes(1)
            expect(spyConsoleError).toHaveBeenCalledTimes(1)
        })
    })
})
