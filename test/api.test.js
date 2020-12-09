import { inactivityListener } from '../src/inactivityListener'

describe('The inactivityListener API', function() {
    let args

    beforeAll(() => {
        args = {
            timeLimit: 500,
            callback: function() {
                console.log('Time is up!')
            },
        }
    })

    afterEach(() => {
        // destroy every spy
        jest.restoreAllMocks()
    })

    describe('start method', function() {
        beforeAll(() => {
            // enable testing code with setTimeout
            jest.useFakeTimers()
        })

        test('start should kick off everything', () => {
            const spyEventListener = jest.spyOn(window, 'addEventListener')
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.start(args.timeLimit, args.callback)
            jest.runAllTimers()

            expect(spyEventListener).toHaveBeenCalledTimes(8)
            expect(spySetTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                args.timeLimit,
            )
        })

        test('start should not yet deliver the callback', () => {
            const spyDelayedCallback = jest.spyOn(args, 'callback')

            inactivityListener.start(args.timeLimit, args.callback)

            jest.advanceTimersByTime(args.timeLimit * 0.9)

            expect(spyDelayedCallback).not.toHaveBeenCalled()

            jest.advanceTimersByTime(args.timeLimit * 0.2)
        })

        test('start should deliver the callback', () => {
            const spyDelayedCallback = jest.spyOn(args, 'callback')

            inactivityListener.start(args.timeLimit, args.callback)
            jest.runAllTimers()

            expect(spyDelayedCallback).toHaveBeenCalledTimes(1)
        })
    })

    describe('reset method', function() {
        test('reset should not work without starting', () => {
            // both start and reset call the timer, reset also clears the timer
            jest.useRealTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')

            inactivityListener.reset()

            expect(spySetTimeout).not.toHaveBeenCalled()
            expect(spyClearTimeout).not.toHaveBeenCalled()
        })

        test('reset should not work when timeout was completed', () => {
            // both start and reset call the timer, reset also clears the timer
            jest.useFakeTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            jest.runAllTimers()
            inactivityListener.reset()

            expect(spySetTimeout).toHaveBeenCalledTimes(1) // cumulated
            expect(spyClearTimeout).toHaveBeenCalledTimes(0)

            jest.runAllTimers()
        })

        test('reset should work after start', () => {
            // both start and reset call the timer, reset also clears the timer
            jest.useRealTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            inactivityListener.reset()

            expect(spySetTimeout).toHaveBeenCalledTimes(2) // cumulated
            expect(spyClearTimeout).toHaveBeenCalledTimes(1)
        })
    })

    describe('restart method', function() {
        test('restart should not work without starting', () => {
            // both start and restart call the timer
            jest.useRealTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.restart()

            expect(spySetTimeout).not.toHaveBeenCalled()
        })

        test('restart should not work when timeout is running', () => {
            // both start and restart call the timer
            jest.useRealTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            inactivityListener.restart()

            expect(spySetTimeout).toHaveBeenCalledTimes(1) // cumulated
        })

        test('restart should work when timeout was completed', () => {
            // both start and restart call the timer
            jest.useFakeTimers()
            const spySetTimeout = jest.spyOn(window, 'setTimeout')

            inactivityListener.start(args.timeLimit, args.callback)

            expect(spySetTimeout).toHaveBeenCalledTimes(1)

            jest.runAllTimers()
            inactivityListener.restart()

            expect(spySetTimeout).toHaveBeenCalledTimes(2) // cumulated

            jest.runAllTimers()
        })
    })

    describe('lapse getter', function() {
        test('lapse should return a numeric timelapse', () => {
            jest.useFakeTimers()
            inactivityListener.start(args.timeLimit, args.callback)

            jest.runAllTimers()
            const inactivity = inactivityListener.lapse

            // console.log('timelapse', timelapse) // 2 not args.timeLimit

            expect(typeof inactivity).toBe('number')
        })
    })

    describe('destroy method', function() {
        test('destroy should clear all timeouts and remove all eventListeners', () => {
            const spyClearTimeout = jest.spyOn(window, 'clearTimeout')
            const spyEventListener = jest.spyOn(window, 'removeEventListener')

            inactivityListener.destroy()

            expect(spyClearTimeout).toHaveBeenCalledTimes(1)
            expect(spyEventListener).toHaveBeenCalledTimes(8)
        })
    })
})
