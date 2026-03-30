export default class SeededRandom {
    constructor(seed) { this.seed = seed; }
    next() {
        const x = Math.sin(this.seed++) * 999;
        return x - Math.floor(x);
    }
}