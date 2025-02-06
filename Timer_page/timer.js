let timerInterval;
let time = 0; // The time is set dynamically
let isPaused = false;
let smallBlind;
let bigBlind;
let playTime;


function startTimer() {
    // Get elements from URL or document
    const timerElement = document.getElementById('timer');
    
    // Check if `timerInterval` already exists and delete it
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Input in minutes to seconds
    time = playTime * 60;
    isPaused = false;

    // Start countdown 
    timerInterval = setInterval(function() {
        if (!isPaused) {
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;

            // Format time so that two digits are always displayed
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            // Format time so that a : is placed between
            timerElement.textContent = minutes + ":" + seconds;

            if (time <= 0) {
                clearInterval(timerInterval);  // End Timer 
                timerInterval = null;  // Set timer to 0
                
                // Double the blinds
                smallBlind = parseFloat(smallBlind) * 2;
                bigBlind = parseFloat(bigBlind) * 2;


                // Update blinds visually
                updateValues(smallBlind, bigBlind);

                // Plays sound
                const sound = new Audio('time_over.mp3');
                sound.play();
            
                // Blind rase message 
                const timeup_message = document.getElementById("timeup_message")
                timeup_message.textContent = "Time up! Blind raised to " + smallBlind + "/" + bigBlind;
                timeup_message.style.display = "block";
                
                // Set a timeout to hide the message after 5 seconds
                setTimeout(function() {
                    timeup_message.style.display = "none";
                }, 5000);
                
                // Restarts timer 
                startTimer();

            }

            time--;
        }
    }, 1000); // Updates every second 
}

// Pause 
function pauseTimer() {
    isPaused = true;
}
// Play 
function resumeTimer() {
    isPaused = false;
}
// Reset 
function resetTimer() {
    window.location.replace("configureTimer/configureTimer.html");
}

// Updates values 
function updateValues(smallBlind, bigBlind) {
    document.getElementById("smallBlindValue").textContent = smallBlind;
    document.getElementById("bigBlindValue").textContent = bigBlind;
}

// Displays timer from the beginning
function displayTimer(seconds, minutes) {
    const timerElement = document.getElementById("timer");
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;  // Fixed: Added 'seconds' variable
    timerElement.textContent = displayMinutes + ":" + displaySeconds
}
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    smallBlind = params.get("smallBlind");
    bigBlind = params.get("bigBlind");
    playTime = params.get("time");
    displayTimer(0, playTime); 
    
    updateValues(smallBlind, bigBlind);
}

