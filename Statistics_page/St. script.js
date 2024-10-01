//home file 

//Add a row Button
function addRow() {
    let table = document.getElementById("pokerStats").getElementsByTagName('tbody')[0]
    let newRow = table.insertRow(1)
  
    let cell1 = newRow.insertCell(0)
    let cell2 = newRow.insertCell(1)
    let cell3 = newRow.insertCell(2)
    let cell4 = newRow.insertCell(3)
  
    cell1.innerHTML = '<input type="number" placeholder="Type here" class="buyIn" oninput="calculateProfitLoss()">'
    cell2.innerHTML = '<input type="number" placeholder="Type here" class="cashReturn" oninput="calculateProfitLoss()">'
    cell3.innerHTML = '<input type="text" readonly class="profit_loss">'
    cell4.innerHTML = '<input type="text" readonly class="total_at_time">'
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

  function successMessage(message) {
    console.log('%c' + message, 'color: green; font-weight: bold;');
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