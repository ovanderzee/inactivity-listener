const demoEvents = [
    'keydown',
    'keyup',
    'scroll',
    'wheel',
]

window.onload = function () {
    const timer = document.querySelector('span#timer')
    const form = document.querySelector('form')

    const waittime = document.querySelector('input#waittime')
    const waittimeout = document.querySelector('output[for="waittime"]')
    const showWaitTime = function () {
        waittimeout.textContent = waittime.value
    }
    waittime.addEventListener('input', showWaitTime)
    showWaitTime()

    const unset = document.querySelector('fieldset#unset')
    const timing = document.querySelector('fieldset#timing')
    const overtime = document.querySelector('fieldset#overtime')

    form.className = 'unset'
    unset.disabled = false;
    timing.disabled = true;
    overtime.disabled = true;
    let demoTimeoutId;

    const showLapse = function() {
        timer.textContent = inactivityListener.lapse
    }

    demoCallback = function () {
        form.className = 'overtime'
        unset.disabled = true;
        timing.disabled = true;
        overtime.disabled = false;
    }

    const start = document.querySelector('button#start')
    start.addEventListener('click', function(event) {
        inactivityListener.start(waittime.value, demoCallback, demoEvents)
        demoTimeoutId = setInterval(showLapse, 321)
        form.className = 'timimg'
        unset.disabled = true;
        timing.disabled = false;
        overtime.disabled = true;
    })

    const reset = document.querySelector('button#reset')
    reset.addEventListener('click', function(event) {
        clearInterval(demoTimeoutId);
        inactivityListener.reset()
        demoTimeoutId = setInterval(showLapse, 321)
        form.className = 'timimg'
        unset.disabled = true;
        timing.disabled = false;
        overtime.disabled = true;
    })

    const restart = document.querySelector('button#restart')
    restart.addEventListener('click', function(event) {
        clearInterval(demoTimeoutId);
        inactivityListener.restart()
        demoTimeoutId = setInterval(showLapse, 321)
        form.className = 'timimg'
        unset.disabled = true;
        timing.disabled = false;
        overtime.disabled = true;
    })

    const stop = document.querySelectorAll('button#stop')
    const stopHandler = function(event) {
        clearInterval(demoTimeoutId);
        inactivityListener.stop()
        timer.textContent = inactivityListener.lapse
        form.className = 'unset'
        unset.disabled = false;
        timing.disabled = true;
        overtime.disabled = true;
    }
    stop[0].addEventListener('click', stopHandler)
    stop[1].addEventListener('click', stopHandler)

}

