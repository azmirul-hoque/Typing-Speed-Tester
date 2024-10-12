const randomText = document.getElementById("random-text");
const inputText = document.getElementById("input-text");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const errorsDisplay = document.getElementById("errors");
const startBtn = document.getElementById("start-btn");

let timer = 60;
let interval = null;
let isPlaying = false;
let errorCount = 0;
let isTyping = false;
let startTime = 60;

const textSamples = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet at least once.",
  "Typing speed can be improved with regular practice. Consistency and focus are essential for mastering typing skills.",
  "JavaScript is a powerful language for web development, allowing developers to create interactive and dynamic web applications.",
  "Consistency is the key to improving your typing skills. With daily practice, anyone can enhance their typing speed and accuracy.",
  "This is a typing speed tester application. It helps users measure their typing speed in words per minute and track their progress over time.",
  "The ability to type quickly and accurately is an important skill in today's digital world. Practice regularly to become proficient.",
  "Learning to type without looking at the keyboard can greatly enhance your typing speed. It is known as touch typing.",
  "In order to improve your typing speed, consider using typing games and online resources that provide practice exercises.",
  "Effective typing skills can save you time and increase your productivity in both academic and professional settings.",
  "As you type, pay attention to your posture and hand positioning to prevent strain and injuries in the long run.",
];

// Function to start the test
function startTest() {
  if (!isPlaying) {
    startBtn.innerText = "Restart Test";
    randomText.innerText = getRandomText();
    inputText.disabled = false;
    inputText.value = "";
    inputText.focus();
    resetTest();
    startTimer();
    isPlaying = true;
  } else {
    resetTest();
  }
}

// Function to reset the test
function resetTest() {
  clearInterval(interval);
  timer = 60;
  errorCount = 0;
  isPlaying = false;
  isTyping = false;
  timerDisplay.innerText = "60";
  wpmDisplay.innerText = "0";
  errorsDisplay.innerText = "0";
  document.getElementById("accuracy").innerText = 0;
  inputText.classList.remove("incorrect", "correct");
  startBtn.innerText = "Start Test";
}

// Function to start the countdown timer
function startTimer() {
  interval = setInterval(() => {
    if (timer > 0 && isTyping) {
      timer--;
      timerDisplay.innerText = timer;
    } else if (timer === 0) {
      clearInterval(interval);
      inputText.disabled = true;
      calculateWPM();
      startBtn.innerText = "Test Completed";
    }
  }, 1000);
}

// Function to calculate WPM (Words Per Minute)
function calculateWPM() {
  const textEntered = inputText.value.trim();
  const wordCount = textEntered.split(/\s+/).length;
  const timeElapsed = (startTime - timer) / 60; // Time in minutes
  const wpm = Math.floor(wordCount / timeElapsed);
  wpmDisplay.innerText = isNaN(wpm) ? 0 : wpm;
  const accuracy = calculateAccuracy(randomText.innerText, textEntered);
  document.getElementById("accuracy").innerText = accuracy; // Update accuracy display
}

// Accuracy Check
function calculateAccuracy(originalText, typedText) {
  let correctCount = 0;

  // Compare the original text and typed text character by character
  for (let i = 0; i < originalText.length; i++) {
    if (typedText[i] === originalText[i]) {
      correctCount++;
    }
  }

  // Calculate accuracy as a percentage
  const accuracy = (correctCount / originalText.length) * 100;
  return isNaN(accuracy) ? 0 : accuracy.toFixed(2); // Return 0 if no characters typed
}

// Function to handle text input and real-time error check
inputText.addEventListener("input", () => {
  const enteredText = inputText.value; // Do not trim here, we need the exact text, including spaces
  if (timer > 0) {
    isTyping = true;
    updateTextHighlight(enteredText);
  }

  // Stop the test if the user finishes typing the entire text
  if (enteredText === randomText.innerText) {
    clearInterval(interval);
    calculateWPM();
    inputText.disabled = true;
    startBtn.innerText = "Test Completed";
  }
});

// Function to highlight correct and incorrect characters in real time
function updateTextHighlight(enteredText) {
  let highlightedText = "";
  errorCount = 0; // Reset error count and recalculate based on current input

  for (let i = 0; i < randomText.innerText.length; i++) {
    const currentChar = randomText.innerText[i] || "";
    const typedChar = enteredText[i] || "";

    if (typedChar === "") {
      highlightedText += `<span>${currentChar}</span>`;
    } else if (typedChar === currentChar) {
      highlightedText += `<span class="correct">${currentChar}</span>`;
    } else {
      highlightedText += `<span class="incorrect">${currentChar}</span>`;
      errorCount++; // Increment error count only for incorrect characters
    }
  }

  randomText.innerHTML = highlightedText; // Update the random text with the highlighted version
  errorsDisplay.innerText = errorCount; // Update the error count display
}

// Function to pause/resume timer when typing stops/resumes
inputText.addEventListener("keydown", (e) => {
  isTyping = true;
  if (!interval && timer > 0) {
    startTimer();
  }

  if (e.key === "Backspace") {
    updateTextHighlight(inputText.value); // Update text and errors when user presses backspace
  }
});

inputText.addEventListener("blur", () => {
  isTyping = false;
});

// Function to get random text
function getRandomText() {
  const randomIndex = Math.floor(Math.random() * textSamples.length);
  return textSamples[randomIndex];
}

startBtn.addEventListener("click", startTest);
