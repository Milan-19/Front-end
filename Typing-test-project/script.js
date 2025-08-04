const errorSound = new Audio("/error.mp3");
const successSound = new Audio("/success.mp3");

document.addEventListener("DOMContentLoaded", () => {
  // Select the elements
  const textToTypeElement = document.getElementById("text-to-type");
  const typingInputElement = document.getElementById("typing-input");
  const speedElement = document.getElementById("speed");
  const accuracyElement = document.getElementById("accuracy");
  const timerElement = document.getElementById("timer");

  // Text to display
  const sampleText = [
    "Believe you can and you're halfway there.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "Everything you've ever wanted is on the other side of fear.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The only person you are destined to become is the person you decide to be.",
    "Your time is limited, don't waste it living someone else's life.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream big and dare to fail.",
    "What you get by achieving your goals is not as important as what you become.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "Do what you can, with what you have, where you are.",
    "The difference between ordinary and extraordinary is that little extra.",
    "Don't be afraid to give up the good to go for the great.",
    "You are never too old to set another goal or to dream a new dream.",
    "The secret of getting ahead is getting started.",
    "Don't count the days, make the days count.",
    "Quality is not an act, it is a habit.",
    "If you want to achieve greatness stop asking for permission.",
    "The only way to achieve the impossible is to believe it is possible.",
    "Success usually comes to those who are too busy to be looking for it.",
    "Your attitude determines your direction.",
    "Life is 10% what happens to you and 90% how you react to it.",
    "Every great story starts with a beginning.",
    "Don't stop until you're proud.",
    "Be the change you wish to see in the world.",
    "Your only limit is your mind.",
    "Make it happen. Shock everyone.",
    "Dream bigger. Do bigger.",
    "The key to success is to focus on goals, not obstacles.",
    "Strive for progress, not perfection.",
    "You are stronger than you think.",
    "Small steps lead to big changes.",
    "Focus on the journey, not the destination.",
    "Great things never come from comfort zones.",
    "Believe in yourself and all that you are.",
    "Your potential is endless.",
    "Success starts with self-discipline.",
    "Turn your dreams into reality.",
    "The harder you fall, the higher you bounce.",
    "Make each day your masterpiece.",
    "Stay positive, work hard, make it happen.",
    "Your future is created by what you do today.",
    "Progress is progress, no matter how small.",
    "Every accomplishment starts with the decision to try.",
    "Don't stop when you're tired. Stop when you're done.",
    "The best way to predict the future is to create it.",
  ];

  // Initial values
  let currentIndex = 0;
  let startTime = new Date();
  let errors = 0;
  let timerInterval;

  // Function to update the speed and the accuracy feedback
  const updateFeedback = () => {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 60000;
    if (elapsedTime === 0) {
      speedElement.textContent = 0;
    } else {
      const wordsTyped = typingInputElement.value.trim().split(/\s+/).length;
      const speed = Math.round(wordsTyped / elapsedTime);
      speedElement.textContent = speed;
    }
    // cal accuracy
    const accuracy =
      currentIndex > 0
        ? Math.round(((currentIndex - errors) / currentIndex) * 100)
        : 100;
    accuracyElement.textContent = accuracy;
  };

  // Function  to initialize or restart the game
  const initializeGame = () => {
    const text = sampleText[Math.floor(Math.random() * sampleText.length)];
    textToTypeElement.textContent = text;
    typingInputElement.value = "";
    currentIndex = 0;
    startTime = new Date();
    errors = 0;
    // update function
    updateFeedback();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  };

  // Function to update timer
  const updateTimer = () => {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    timerElement.textContent = elapsedSeconds;
  };

  // Modify checkCharacter function
  const checkCharacter = (inputChar, targetChar) => {
    if (inputChar !== targetChar) {
      errors++;
      errorSound.currentTime = 0;
      errorSound.play();
      return false;
    } else {
      successSound.currentTime = 0;
      successSound.play();
      return true;
    }
  };

  // Function to display messages to the user
  const displayMessage = (message) => {
    const messageArea = document.getElementById("message-area");
    messageArea.textContent = message;
    // Clear the message after 3 seconds
    setTimeout(() => {
      messageArea.textContent = "";
    }, 3000);
  };

  // Event listener for typing input
  typingInputElement.addEventListener("input", () => {
    const typedText = typingInputElement.value;
    const targetText = textToTypeElement.textContent;
    if (currentIndex < targetText.length) {
      const isCorrect = checkCharacter(
        typedText[currentIndex],
        targetText[currentIndex]
      );

      textToTypeElement.innerHTML =
        targetText.substring(0, currentIndex) +
        `<span class="${isCorrect ? "correct" : "incorrect"}">${
          targetText[currentIndex]
        }</span>` +
        targetText.substring(currentIndex + 1);
      currentIndex++;
      if (currentIndex === targetText.length) {
        // Update final score
        updateFeedback();
        // Display completion message with final score
        const finalSpeed = speedElement.textContent;
        const finalAccuracy = accuracyElement.textContent;
        displayMessage(
          `Congratulations! Your speed: ${finalSpeed} WPM, Accuracy: ${finalAccuracy}%. New text in 5 seconds...`
        );
        // Disable input during the wait period
        typingInputElement.disabled = true;
        // Wait 5 seconds before starting new game
        setTimeout(() => {
          initializeGame();
          typingInputElement.disabled = false;
          typingInputElement.focus();
        }, 5000);
      }
    }
    // update the feedback
    updateFeedback();
  });
  // Add this after other event listeners
  const restartButton = document.getElementById("restart");
  restartButton.addEventListener("click", initializeGame);

  initializeGame();
});
