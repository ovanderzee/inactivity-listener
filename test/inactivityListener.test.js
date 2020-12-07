import { inactivityListener } from '../src/inactivityListener'

describe('The API', function() {
    let args

    beforeAll(() => {
        args = {
            timeLimit: 34672,
            callback: function() {
                console.log('Time is up!')
            },
        }

        //enable testing code with setTimeout
        jest.useFakeTimers()
    })

    afterEach(() => {
        // destroy every spy
        jest.restoreAllMocks()
    })

    test('start should kick off everything', () => {
        const spyEventListener = jest.spyOn(window, 'addEventListener')
        const spySetTimeout = jest.spyOn(window, 'setTimeout')

        inactivityListener.start(args.timeLimit, args.callback)

        expect(spyEventListener).toHaveBeenCalledTimes(8)
        expect(spySetTimeout).toHaveBeenCalledWith(
            expect.any(Function),
            args.timeLimit,
        )
    })

    test('start should deliver the callback', () => {
        const spyDelayedCallback = jest.spyOn(args, 'callback')

        inactivityListener.start(args.timeLimit, args.callback)
        jest.runAllTimers()

        expect(spyDelayedCallback).toHaveBeenCalledTimes(1)
    })
})
