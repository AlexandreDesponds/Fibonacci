import {Benchmark} from './fibonacci.js'

class Process{

    input; buttonSubmit; buttonStart; benchmark

    isInProgress = false
    options = {loop: true, memory: true, recursive: true}

    constructor() {
        this.benchmark = new Benchmark()
        this.input = document.querySelector('input')
        this.buttonSubmit = document.querySelector('#submit')
        this.buttonStart = document.querySelector('#start')
        this.initEvents()
    }

    initEvents(){
        this.input.addEventListener('keypress', (event) => {
            if(event.key === 'Enter')
                this.run()
        });

        this.buttonSubmit.addEventListener('click', (_) => {
            this.run()
        });

        this.buttonStart.addEventListener('click', (_) => {
            this.start();
        });

        document.querySelectorAll('.benchmark>div').forEach((value) => {
            value.addEventListener('click', (_) => {
                this.toggle(value)
            })
        })
    }

    run(){
        if(this.input.value >= 40)
            this.options.recursive = false
        const results = this.benchmark.runAll(this.input.value, this.options)
        Object.keys(results.benchmarks).forEach(key => {
            document.querySelector('#' + key + ' .results').prepend(this.generateResult(results.benchmarks[key], results.deep, results.best));
        })
        return new Promise(resolve => setTimeout(() => {
            resolve()
        }, 100))
    }

    async start(){
        this.isInProgress = !this.isInProgress
        if (this.isInProgress) {
            this.buttonStart.classList.add('progress')
        } else {
            this.buttonStart.classList.remove('progress')
        }

        while(this.isInProgress){
            this.input.value = parseInt(this.input.value) + 1
            await this.run()
        }
    }

    generateResult(data, deep, best){
        let div = document.createElement('div')
        if (data) {
            const time = data.timeEnd - data.timeStart
            const perf = ((100 / best) * time).toFixed(0)
            div.style.backgroundColor = this.percentageToColor(perf)
            div.innerHTML = '<div class="title"><span>résultat</span><span>valeur</span></div>' +
                '<div><span>' + data.result + '</span><span>' + deep + '</span></div>' +
                '<div><span>' + time.toFixed(5) + ' ms</span><span id="perf"></div>'
            if (perf > 100){
                div.querySelector('#perf').innerHTML = '<i class="fa fa-chevron-circle-up"></i> ' + perf + ' %</span>'
            }
        }
        return div
    }

    percentageToColor(percentage, maxHue = 0, minHue = 118) {
        percentage /= 500
        if (percentage > 1)
            percentage = 1
        const hue = percentage * (maxHue - minHue) + minHue
        return `hsl(${hue}, 47%, 43%)`
    }

    toggle(value){
        this.options[value.id] = !this.options[value.id]
        if (this.options[value.id]){
            value.classList.remove('hidden')
        } else {
            value.classList.add('hidden')
        }
    }
}

new Process()
