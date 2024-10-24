let timerInterval;
let time = 0; // Die Zeit wird dynamisch gesetzt
let isPaused = false;

function startTimer() {
    const timerElement = document.getElementById('timer');
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const input3 = document.getElementById('input3');

    // Umwandlung der Eingabezeit in Sekunden
    const duration = parseFloat(input3.value);
    const NaN_message = document.getElementById("NaN_message");
    if (isNaN(duration) || duration <= 0) {
        NaN_message.textContent = "The number that was entered is Not a Number";
        NaN_message.style.display = "block";
        
        // Set a timeout to hide the message after 5 seconds
        setTimeout(function() {
            NaN_message.style.display = "none";
        }, 5000);

        duration = 0
    } 


    // Überprüfen, ob `timerInterval` bereits existiert, und dieses löschen
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    time = duration * 60;
    isPaused = false;

    // Countdown starten
    timerInterval = setInterval(function() {
        if (!isPaused) {
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;

            // Zeit formatieren, sodass immer zwei Ziffern angezeigt werden
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            timerElement.textContent = minutes + ":" + seconds;

            if (time <= 0) {
                clearInterval(timerInterval);  // Timer beenden
                timerInterval = null;  // Sicherstellen, dass `timerInterval` zurückgesetzt wird
                
                // Zahlen in den Eingabefeldern verdoppeln
                input1.value = parseFloat(input1.value) * 2;
                input2.value = parseFloat(input2.value) * 2;

                // Ton abspielen
                const sound = new Audio('Time_over.mp3');
                sound.play();
            
                // Nachricht anzeigen
                const timeup_message = document.getElementById("timeup_message")
                timeup_message.textContent = "Time up! Blind rase";
                timeup_message.style.display = "block";
                
                // Set a timeout to hide the message after 5 seconds
                setTimeout(function() {
                    timeup_message.style.display = "none";
                }, 5000);
                
                // Timer nach Ablauf neu startens
                startTimer();
            }

            time--;
        }
    }, 1000); // Aktualisierung alle 1 Sekunde
}

function pauseTimer() {
    isPaused = true;
}

function resumeTimer() {
    isPaused = false;
}

function resetTimer() {
    input1.value = '0';
    input2.value = '0';
    input3.value = '0';
    // Clear the existing timer interval
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset the time to 0
    time = 0;
    
    // Reset the paused state to false
    isPaused = false;
    
    // Clear any displayed messages (optional)
    const NaN_message = document.getElementById("NaN_message");
    const timeup_message = document.getElementById("timeup_message");
    if (NaN_message) {
        NaN_message.textContent = "";
        NaN_message.style.display = "none";
    }
    if (timeup_message) {
        timeup_message.textContent = "";
        timeup_message.style.display = "none";
    }
    
    // Update the timer display to show 00:00
    const timerElement = document.getElementById('timer');
    timerElement.textContent = "00:00";
}
// Function to update both Small and Big Blind values in real-time
function updateValues() {
    const input1Value = document.getElementById("input1").value;
    const input2Value = document.getElementById("input2").value;

    document.getElementById("smallBlindValue").textContent = input1Value;
    document.getElementById("bigBlindValue").textContent = input2Value;
}

// Set an interval to update the values every second (1000 milliseconds)
setInterval(() => {
    updateValues();
}, 1000);
