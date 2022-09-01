declare const index: {
    start: (waitTime: number, action: Function, eventNames: string[]) => void;
    reset: () => void;
    readonly lapse: number;
    restart: () => void;
    stop: () => void;
};

export { index as default };
