export interface StartArgs {
    timeLimit: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: () => any
    eventNames?: string[]
}
