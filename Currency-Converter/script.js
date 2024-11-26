// Initialize Feather icons for any elements that need icons
// feather.replace() to replace placeholders with actual icons
feather.replace();

// necessary DOM elements
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("result");
const baseCurrency = document.getElementById("base-currency");
const getRatesBtn = document.getElementById("get-rates-btn");
const exchangeRates = document.getElementById("exchange-rates");
const convertMode = document.getElementById("convert-mode");
const exchangeMode = document.getElementById("exchange-mode");
const toggleBtns = document.querySelectorAll(".toggle-btn");

//  API key for accessing the ExchangeRate-API
const apiKey = "27f549812fd48eddc8851b88";

countrys.forEach((data) => {
  fromCurrency.innerHTML += `<option value="${data.code}">${data.code} - ${data.currency}</option>`;
  toCurrency.innerHTML += `<option value="${data.code}">${data.code} - ${data.currency}</option>`;
  baseCurrency.innerHTML += `<option value="${data.code}">${data.code} - ${data.currency}</option>`;
});

// event listeners for toggling between conversion and exchange modes
toggleBtns.forEach((btn) => {
  // click event listeners to toggle buttons to switch between modes
  // Update the UI to reflect the selected mode (conversion or exchange)
  btn.addEventListener("click", () => {
    toggleBtns.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");
    const mode = btn.getAttribute("data-mode");
    if (mode === "convert") {
      convertMode.style.display = "flex";
      exchangeMode.style.display = "none";
    } else {
      convertMode.style.display = "none";
      exchangeMode.style.display = "flex";
    }
  });
});

// Implement the currency conversion functionality
convertBtn.addEventListener("click", () => {
  // click event listener to the convert button
  // Get the amount, from-currency, and to-currency values from the user
  const amount = amountInput.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  // Fetch the conversion rate from the API using the selected currencies
  fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Calculate the converted amount and update the result display with the converted value and currency symbol
      const rate = data.conversion_rate;
      const convertedAmount = (amount * rate).toFixed(2);
      result.innerHTML = `<span class="currency-icon"></span>${convertedAmount} ${to}`;
    })
    .catch((error) => {
      console.log(error);
      // Handle any errors that occur during the API request and provide feedback to the user
    });
});

// Implement the exchange rates retrieval functionality
// click event listener to the get rates button
getRatesBtn.addEventListener("click", () => {
  // Get the base currency from the user
  const base = baseCurrency.value;
  // Fetch the exchange rates from the API based on the selected base currency
  fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`)
    .then((response) => {
      return response.json();
      // Display the fetched exchange rates in a list format within the exchange rates section
    })
    .then((data) => {
      let ratesHtml = "<h3>Exchange Rates</h3><ul>";
      for (const [currency, rate] of Object.entries(data.conversion_rates)) {
        if (currency !== base) {
          ratesHtml += `<li><span class="currency-icon">${currency}</span>${currency}: ${rate.toFixed(
            4
          )}</li>`;
        }
      }
      ratesHtml += "</ul>";
      exchangeRates.innerHTML = ratesHtml;
    })
    .catch((error) => {
      // Handle any errors that occur during the API request and provide feedback to the user
      exchangeRates.textContent = "An error occurred. Please try again.";
    });
});

// Step 7: Create a helper function to return the appropriate currency symbol based on the currency code
//   - Define a getCurrencySymbol function that maps common currency codes to their symbols

// Step 8: Test the application to ensure all functionality works as expected
//   - Verify that feather.replace() correctly replaces placeholders with icons
//   - Check that the mode toggling works as intended
//   - Ensure that currency conversion is accurate and displayed properly
//   - Validate that exchange rates are correctly retrieved and displayed

// Step 9: Implement error handling to provide user feedback in case of issues with API requests
//   - Ensure that all fetch requests handle errors gracefully and update the UI accordingly

// Step 10: Consider future enhancements, such as adding more currency symbols, improving the UI with animations, or integrating additional features like historical exchange rates or comparison tools
