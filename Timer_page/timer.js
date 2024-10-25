let timerInterval;
let time = 0; // Die Zeit wird dynamisch gesetzt
let isPaused = false;

function startTimer() {
    const timerElement = document.getElementById('timer');

    const params = new URLSearchParams(window.location.search);
    let smallBlind = params.get("smallBlind");
    let bigBlind = params.get("bigBlind");
    let playTime = params.get("time");

    // Umwandlung der Eingabezeit in Sekunden
    const duration = parseFloat(playTime);
    const NaN_message = document.getElementById("NaN_message");
    if (isNaN(duration) || duration <= 0) {
        NaN_message.textContent = "The number that was entered is Not a Number";
        NaN_message.style.display = "block";
        
        // Set a timeout to hide the message after 5 seconds
        setTimeout(function() {
            NaN_message.style.display = "none";
            // window.location.replace("configureTimer/configureTimer.html");
        }, 5000);
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
                smallBlind = parseFloat(smallBlind) * 2;
                bigBlind = parseFloat(bigBlind) * 2;

                // Update blinds visually
                updateValues(smallBlind, bigBlind);

                // Ton abspielen
                const sound = new Audio('Time_over.mp3');
                sound.play();
            
                // Nachricht anzeigen
                const timeup_message = document.getElementById("timeup_message")
                timeup_message.textContent = "Time up! Blind raised to " + smallBlind + "/" + bigBlind;
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
    window.location.replace("configureTimer/configureTimer.html");
}

function updateValues(smallBlind, bigBlind) {
    document.getElementById("smallBlindValue").textContent = smallBlind;
    document.getElementById("bigBlindValue").textContent = bigBlind;
}

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const smallBlind = params.get("smallBlind");
    const bigBlind = params.get("bigBlind");

    updateValues(smallBlind, bigBlind);
}