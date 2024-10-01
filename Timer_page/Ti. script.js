let timerInterval;
let time = 10 * 60; // 10 minutes in seconds
let isPaused = false;

function startTimer() {
    const timerElement = document.getElementById('timer');

    // Reset time to 10 minutes when starting the timer
    time = 10 * 60;
    isPaused = false;

    // Clear any previous intervals
    clearInterval(timerInterval);

    // Start the countdown
    timerInterval = setInterval(function() {
        if (!isPaused) {
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;

            // Format time so it always displays two digits for both minutes and seconds
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            timerElement.textContent = minutes + ":" + seconds;

            if (time === 0) {
                clearInterval(timerInterval);
                alert("Time's up!");
            }

            time--;
        }
    }, 1000); // Update the timer every 1 second
}

function pauseTimer() {
    isPaused = true;
}

function resumeTimer() {
    isPaused = false;
}