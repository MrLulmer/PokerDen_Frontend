// Timer variables
let totalSeconds;
let secondsRemaining;
let isRunning = false;
let timerInterval;

// Blinds variables
let smallBlind;
let bigBlind;

// DOM elements
const timeDisplay = document.getElementById('timer'); // Changed from 'timeDisplay' to 'timer'
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const backBtn = document.getElementById('backBtn'); // Added this line
const progressBar = document.getElementById('progressBar');
const smallBlindDisplay = document.getElementById('smallBlindValue');
const bigBlindDisplay = document.getElementById('bigBlindValue');
const timeupMessage = document.getElementById('timeup_message');

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update the timer display and progress bar
function updateDisplay() {
    timeDisplay.textContent = formatTime(secondsRemaining);
    const progressPercentage = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Update blinds values in the UI
function updateBlindValues(small, big) {
    smallBlindDisplay.textContent = small;
    bigBlindDisplay.textContent = big;
}

// Start or resume the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = "Resume";
        pauseBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            secondsRemaining--;
            updateDisplay();
            
            if (secondsRemaining <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                
                // Double the blinds
                smallBlind = parseFloat(smallBlind) * 2;
                bigBlind = parseFloat(bigBlind) * 2;
                
                // Update blinds visually
                updateBlindValues(smallBlind, bigBlind);
                
                // Play sound for blind increase
                const sound = new Audio('time_over.mp3');
                sound.play();
                
                // Show blind raise message
                timeupMessage.textContent = "Time up! Blind raised to " + smallBlind + "/" + bigBlind;
                timeupMessage.style.display = "block";
                
                // Hide the message after 5 seconds
                setTimeout(function() {
                    timeupMessage.style.display = "none";
                }, 5000);
                
                // Reset the timer for the next round
                secondsRemaining = totalSeconds;
                updateDisplay();
                startTimer(); // Auto-start next round
            }
        }, 1000);
    }
}

// Pause the timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        pauseBtn.disabled = true;
    }
}

// Back function
function back() {
    window.location.replace("configureTimer/configureTimer.html");
}

// Get timer duration and blind values from URL
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const urlTime = params.get("time");
    smallBlind = params.get("smallBlind");
    bigBlind = params.get("bigBlind");
    
    // Set defaults if parameters are missing
    if (!urlTime) totalSeconds = 5 * 60; // Default 5 minutes
    else totalSeconds = parseInt(urlTime) * 60;
    
    if (!smallBlind) smallBlind = 5; // Default small blind
    if (!bigBlind) bigBlind = 10; // Default big blind
    
    secondsRemaining = totalSeconds;
    
    // Initialize the displays
    updateDisplay();
    updateBlindValues(smallBlind, bigBlind);
    
    // Disable pause button initially
    pauseBtn.disabled = true;
}

// Set up event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
backBtn.addEventListener('click', back);