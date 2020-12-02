class Fibonacci {

    deep

    constructor(deep = 0) {
        this.deep = deep
    }

    recursive(deep = this.deep) {
        if (deep <= 1) return 1
        return this.recursive(deep - 1) + this.recursive(deep - 2)
    }

    memory(deep, data = {}){
        if (data[deep]) return data[deep]
        if (deep <= 1) return 1
        return data[deep] = this.memory(deep - 1, data) + this.memory(deep - 2, data)
    }

    loop(deep = this.deep){
        let val1 = 1, val2 = 0, valTmp

        while (deep >= 0) {
            valTmp = val1
            val1 += val2
            val2 = valTmp
            deep--
        }

        return val2
    }
}

export class Benchmark{

    deep = 0
    fib

    constructor(){
        this.fib = new Fibonacci(this.deep)
    }

    runAll(deep = 0, options = {recursive: true, loop: true, memory: true}){
        this.deep = deep
        let results = {
            deep: this.deep,
            best: null,
            benchmarks: {
                recursive: options.recursive ? this.run('recursive'): null,
                loop: options.loop ?  this.run('loop'): null,
                memory: options.memory ?  this.run('memory'): null
            }
        }
        results.best = this.findTheBest(results)
        return results
    }

    run(func){
        return {
            timeStart: performance.now(),
            result: this.fib[func](this.deep),
            timeEnd: performance.now(),
        }
    }

    findTheBest(results){
        let best = null
        Object.keys(results.benchmarks).forEach(key => {
            if (results.benchmarks[key] && (results.benchmarks[key].timeEnd - results.benchmarks[key].timeStart < best || !best))
                best = results.benchmarks[key].timeEnd - results.benchmarks[key].timeStart
        })
        return best === 0 ? 1: best
    }
}
