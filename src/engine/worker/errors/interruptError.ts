class InterruptError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "InterruptError";
    }
}

export default InterruptError;
