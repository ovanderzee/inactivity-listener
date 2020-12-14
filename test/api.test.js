import { inactivityListener } from '../src/inactivityListener'

// suppress alarming messages in output and make call to function testable
console.error = jest.fn()

describe('The inactivityListener API', function () {
    let args
    let eventTypeCount = 8

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

    describe('start method', function () {
        afterEach(() => inactivityListener.destroy())

        test('start should kick off everything', () => {
            jest.useFakeTimers()
            const spyEventListener = jest.spyOn(window, 'addEventListener')
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.start(args.timeLimit, args.callback)
            jest.runAllTimers()

            expect(spyEventListener).toHaveBeenCalledTimes(eventTypeCount)
            expect(spySetTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                args.timeLimit,
            )
        })

        test('start should call back when the timeLimit was reached', () => {
            jest.useFakeTimers()
            const spyDelayedCallback = jest.spyOn(args, 'callback')

            inactivityListener.start(args.timeLimit, args.callback)
            jest.runAllTimers()

            expect(spyDelayedCallback).toHaveBeenCalledTimes(1)
        })

        test('start should not call back when the timeLimit was not reached', () => {
            jest.useFakeTimers()
            const spyDelayedCallback = jest.spyOn(args, 'callback')

            inactivityListener.start(args.timeLimit, args.callback)
            jest.advanceTimersByTime(args.timeLimit * 0.9)

            expect(spyDelayedCallback).not.toHaveBeenCalled()

            jest.advanceTimersByTime(args.timeLimit * 0.2)
        })

        test('start should error on a faulty callback', () => {
            args.faultyCallback = function () {
                throw 'An error should be thrown!'
            }
            jest.useFakeTimers()
            const spyFaultyCallback = jest.spyOn(args, 'faultyCallback')
            const spyConsoleError = jest.spyOn(console, 'error')

            inactivityListener.start(args.timeLimit, args.faultyCallback)
            jest.runAllTimers()

            expect(spyFaultyCallback).toHaveBeenCalledTimes(1)
            expect(spyConsoleError).toHaveBeenCalledTimes(1)
        })
    })

    describe('reset method', function () {
        // both start and reset call the timer, reset also clears the timer
        afterEach(() => inactivityListener.destroy())

        test('reset should work after starting', () => {
            jest.useRealTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            inactivityListener.reset()

            expect(spySetTimeout).toHaveBeenCalledTimes(2) // cumulated
            expect(spyClearTimeout).toHaveBeenCalledTimes(1)
        })

        test('reset should not work without starting', () => {
            jest.useRealTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')

            inactivityListener.reset()

            expect(spySetTimeout).not.toHaveBeenCalled()
            expect(spyClearTimeout).not.toHaveBeenCalled()
        })

        test('reset should not work when timeout was completed', () => {
            jest.useFakeTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            jest.runAllTimers() // completes timeout
            inactivityListener.reset()

            expect(spySetTimeout).toHaveBeenCalledTimes(1) // cumulated
            expect(spyClearTimeout).not.toHaveBeenCalled()
        })
    })

    describe('restart method', function () {
        // both start and restart call the timer
        afterEach(() => inactivityListener.destroy())

        test('restart should work when timeout was completed', () => {
            jest.useFakeTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            jest.runAllTimers()
            inactivityListener.restart()

            expect(spySetTimeout).toHaveBeenCalledTimes(2) // cumulated
        })

        test('restart should not work when timeout is running', () => {
            jest.useFakeTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            jest.advanceTimersByTime(args.timeLimit * 0.5)
            inactivityListener.restart()

            expect(spySetTimeout).toHaveBeenCalledTimes(1) // cumulated
        })

        test('restart should not work without starting', () => {
            jest.useRealTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.restart()

            expect(spySetTimeout).not.toHaveBeenCalled()
        })
    })

    describe('lapse getter', function () {
        test('lapse should return a numeric timelapse', () => {
            jest.useFakeTimers()
            inactivityListener.start(args.timeLimit, args.callback)
            jest.runAllTimers()

            // lapse recorded shortly after start is called
            const inactivity = inactivityListener.lapse

            expect(typeof inactivity).toBe('number')
            // might the next expectation fail on a busy server?
            expect(inactivity >= 0 && inactivity < 25).toBeTruthy()
        })
    })

    describe('destroy method', function () {
        test('destroy should clear all timeouts and remove all eventListeners', () => {
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')
            const spyEventListener = jest.spyOn(window, 'removeEventListener')

            expect(spyClearTimeout).not.toHaveBeenCalled()

            inactivityListener.destroy()

            expect(spyClearTimeout).toHaveBeenCalledTimes(1)
            expect(spyEventListener).toHaveBeenCalledTimes(eventTypeCount)
        })
    })
})
