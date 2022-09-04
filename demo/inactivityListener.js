window.onload = function () {
    const timer = document.querySelector('span#timer')
    const form = document.querySelector('form')

    const waittime = document.querySelector('input#waittime')
    const waittimeout = document.querySelector('output[for="waittime"]')
    waittime.addEventListener('input', function(event) {
        waittimeout.textContent = this.value
    })
    waittimeout.textContent = waittime.value

    const unset = document.querySelector('fieldset#unset')
    const timing = document.querySelector('fieldset#timing')
    const overtime = document.querySelector('fieldset#overtime')

    form.className = 'unset'
    unset.disabled = false;
    timing.disabled = true;
    overtime.disabled = true;
    demoCallback = function () {
        timer.textContent = inactivityListener.lapse
        form.className = 'timimg'
        unset.disabled = true;
        timing.disabled = true;
        overtime.disabled = false;
    }

    const start = document.querySelector('button#start')
    start.addEventListener('click', function(event) {
        inactivityListener.start(waittime.value, demoCallback)
        timer.textContent = inactivityListener.lapse
        form.className = 'timimg'
        unset.disabled = true;
        timing.disabled = false;
        overtime.disabled = true;
    })
    const reset = document.querySelector('button#reset')
    reset.addEventListener('click', function(event) {
        inactivityListener.reset()
        timer.textContent = inactivityListener.lapse
        form.className = 'timimg'
        unset.disabled = true;
        timing.disabled = false;
        overtime.disabled = true;
    })
    const restart = document.querySelector('button#restart')
    restart.addEventListener('click', function(event) {
        inactivityListener.restart()
        timer.textContent = inactivityListener.lapse
        form.className = 'timimg'
        unset.disabled = true;
        timing.disabled = false;
        overtime.disabled = true;
    })
    const stop = document.querySelectorAll('button#stop')
    const stopHandler = function(event) {
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

