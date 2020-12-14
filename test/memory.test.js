import { inactivityListener } from '../src/inactivityListener'

describe('Prevent memoryleaks', function () {
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

    describe('the start function', function () {
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
})
