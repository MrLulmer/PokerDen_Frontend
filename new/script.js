let runningTotal = [0]


function addEntry(button) {
    let buyIn = button.parentElement.querySelector("#buyIn");
    let cashReturn = button.parentElement.querySelector("#cashReturn");

    let profit_loss = cashReturn.value - buyIn.value;
    let latestValue = runningTotal[runningTotal.length - 1];
    runningTotal.push(latestValue + profit_loss);

    buyIn.value = 0;
    cashReturn.value = 0;

    console.log(runningTotal);
    updateChart();
}

function updateChart() {
    let canvas = document.getElementById("runningTotalChart");

    // Get the 2D rendering context of the canvas
    let ctx = canvas.getContext("2d");

    // Create a new Chart instance
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: runningTotal.map((_, i) => i + 1),
            datasets: [{
                label: 'Running Total',
                borderColor: 'rgb(75, 192, 192)',
                data: runningTotal,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    min: 0
                }
            }
        }
    });
}

window.onload = function() {
    updateChart();
};
