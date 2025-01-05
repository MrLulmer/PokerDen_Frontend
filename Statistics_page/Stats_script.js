// Add a row Button
let sessionCount = 1;  // Initialize a session count variable

function addRow() {
    let table = document.getElementById("pokerStats").getElementsByTagName('tbody')[0];
    
    // Check if there are any existing rows to insert above
    const rowIndex = table.rows.length > 1 ? table.rows.length - 1 : 0; // Insert above the last row

    let newRow = table.insertRow(rowIndex); // Insert at the specified row index

    // Create cells
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);
    let cell5 = newRow.insertCell(4);

    // Set cell content
    cell1.innerHTML = '<input type="number" placeholder="Type here" class="buyIn" oninput="calculateProfitLoss()">';
    cell2.innerHTML = '<input type="number" placeholder="Type here" class="cashReturn" oninput="calculateProfitLoss()">';
    cell3.innerHTML = '<input type="text" readonly class="profit_loss">';
    cell4.innerHTML = '<input type="text" readonly class="total_at_time">';

    // Increment session count and update the session number in the new row
    sessionCount++;
    cell5.innerHTML = `<span class="sessionNum">Session <span id="sessionNumber">${sessionCount}</span></span>`;
}
 
//Calculates the Total Profit/Loss 
function calculateProfitLoss() {    
  let rows = document.getElementsByClassName("buyIn")
  let totalProfitLoss = 0
  let runningTotal = []

  for (let i = 0; i < rows.length; i++) {
    let buyIn = parseFloat(rows[i].value) || 0
    let cashReturn = parseFloat(document.getElementsByClassName("cashReturn")[i].value) || 0
    let profitLoss = cashReturn - buyIn
    totalProfitLoss += profitLoss
    runningTotal[i] = totalProfitLoss.toFixed(2)
    document.getElementsByClassName("profit_loss")[i].value = profitLoss.toFixed(2)
    document.getElementsByClassName("total_at_time")[i].value = runningTotal[i]
  }
  
  document.getElementById("total").value = totalProfitLoss.toFixed(2)
  return runningTotal
}

// Makes Chart 
const ctx = document.getElementById('myChart').getContext('2d');
let chartData = []; // Store total for the chart
// Build of the Chart 
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Labels for each entry (e.g., Session 1, Session 2)
    datasets: [{
      label: 'Total over Time',
      data: chartData,
      borderColor: 'rgba(75, 192, 192, 1)', // Line color
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color under line
      fill: true,
      tension: 0.2
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.2)', // Color grid line 
          lineWidth: 1 // Thickness 
        },
        ticks: {
          color: '#000000', // Color for X-axis labels
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.2)', // Color grid line
          lineWidth: 1 // Thickness 
        },
        ticks: {
          color: '#000000', // Color for Y-axis labels 
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#000000', // Color for the label text
        }
      }
    }
  }
});
// Plots data nd adds to the chart 
function plotData() {
  const buyIns = document.querySelectorAll('.buyIn');
  const cashReturns = document.querySelectorAll('.cashReturn');
  const profitLosses = document.querySelectorAll('.profit_loss');
  const totals = document.querySelectorAll('.total_at_time');
  
  let cumulativeTotal = 0;
  chartData.length = 0; // Clear chart data for fresh input
  
  buyIns.forEach((buyInInput, index) => {
    const cashReturnInput = cashReturns[index];
    const profitLossInput = profitLosses[index];
    const totalAtTimeInput = totals[index];
    
    // Convert values to numbers
    const buyIn = parseFloat(buyInInput.value) || 0;
    const cashReturn = parseFloat(cashReturnInput.value) || 0;
    
    // Calculate profit/loss and cumulative total
    const profitLoss = cashReturn - buyIn;
    cumulativeTotal += profitLoss;
    
    // Update the table's profit/loss and total at this point
    profitLossInput.value = profitLoss;
    totalAtTimeInput.value = cumulativeTotal;
    
    // Add cumulative total to chart data
    chartData.push(cumulativeTotal);
    
    // Set labels as "Session 1", "Session 2", etc.
    myChart.data.labels[index] = `Session ${index + 1}`;
  });
  
  // Update final total in table
  document.getElementById('total').value = cumulativeTotal;
  
  // Refresh the chart
  myChart.update();
}

// Get data from backend
async function getDataFromBackend() {
  try {
    const response = await fetch('http://127.0.0.1:5000/about', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.ok) {
      successMessage('🎉 Success! You nailed it!');
    }

    const data = await response.json();
    console.log(data); // Do something with the data
  } catch (error) {
    console.error('Error fetching data from backend:', error);
  }
}
function successMessage(message) {
  console.log('%c' + message, 'color: green; font-weight: bold;');
}