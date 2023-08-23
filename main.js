//SpeechRecognition object for speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-GB';
recognition.continuous= true;
recognition.interimResults = false;

let isSpeechRecognitionActive = false;
let userVoiceAnswer = ''; // Variable to store the user's voice answer


let questions = [
  {
    question: "Is the Great Wall of China visible from space?",
    answer: "no",
    explanation: "Despite a popular belief, the Great Wall of China cannot be seen from space with the naked eye."
  },
  {
    question: "Is the Mona Lisa a painting by Vincent van Gogh?",
    answer: "no",
    explanation: "The Mona Lisa is a famous painting created by Leonardo da Vinci, not Vincent van Gogh."
  },
  {
    question: "Did Neil Armstrong walk on the moon in 1969?",
    answer: "yes",
    explanation: "Neil Armstrong, along with Buzz Aldrin, became the first astronauts to walk on the moon during the Apollo 11 mission in 1969."
  },
  {
    question: "Is the currency of Japan called the yen?",
    answer: "yes",
    explanation: "The official currency of Japan is the yen, which is denoted by the symbol ¥."
  },
  {
    question: "Is soccer called football in the United States?",
    answer: "no",
    explanation: "In the United States, the sport commonly referred to as soccer is called soccer, while football generally refers to American football."
  },
  {
    question: "Is water an element on the periodic table?",
    answer: "no",
    explanation: "Water, with the chemical formula H2O, is a compound composed of two hydrogen atoms and one oxygen atom. It is not an element."
  }
];

let currentQuestionIndex = 0;
let currentQuestion = questions[currentQuestionIndex];

// Handle the startButton click to start the game
document.getElementById('startButton').addEventListener('click', () => {
  startGame();
});


function nextQuestion() {
  userVoiceAnswer = ''; // Clear the user's voice answer before moving to the next question
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    const feedbackDiv = document.getElementById('feedback'); // Get the feedback element
    if (feedbackDiv) {
      feedbackDiv.remove(); // Remove the feedback element if it exists
    }
    currentQuestion = questions[currentQuestionIndex];
    showQuestion();
    //startSpeechRecognition(); // Start speech recognition for the new question
  } 
  else {
    const feedbackDiv = document.getElementById('feedback'); // Get the feedback element
    if (feedbackDiv) {
      feedbackDiv.remove(); // Remove the feedback element if it exists
    }
    endGame();
  }
}

// Handle the nextButton click to move to the next question
document.getElementById('nextButton').addEventListener('click', () => {
  nextQuestion();
});


// Stop speech recognition
function stopSpeechRecognition() {
  isSpeechRecognitionActive = false;
  recognition.stop();
}

document.getElementById('answerInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    processAnswer(); // Process the user's answer and display feedback
  }
});



// Start the game
function startGame() {
  document.getElementById('startButton').style.display = 'none';
  document.getElementById('questionContainer').style.display = 'block';
  startSpeechRecognition();
  currentQuestionIndex = 0; // Reset the question index for a new game
  currentQuestion = questions[currentQuestionIndex];
  showQuestion();
}

// Start speech recognition
function startSpeechRecognition() {
  if (!isSpeechRecognitionActive) {
  isSpeechRecognitionActive = true;
  recognition.start();
  }
}



recognition.onresult = function (event) {
  if (isSpeechRecognitionActive) {
    userVoiceAnswer = event.results[event.results.length - 1][0].transcript;
    console.log('User voice answer:', userVoiceAnswer);
    
    // Clean and lowercase the user's voice answer
    const cleanedAnswer = userVoiceAnswer.trim().toLowerCase();
    
    if (cleanedAnswer === "yes" || cleanedAnswer === "no") {
      document.getElementById('answerInput').value = cleanedAnswer;
      processAnswer(); // Process the user's answer and display feedback
    } 
    if (cleanedAnswer === "next") {
      nextQuestion(); // Trigger the "Next" action
    }
    if (cleanedAnswer === "repeat") {
      repeatQuestion();
    }
    else {
      console.log('Unrecognized answer:', userVoiceAnswer);
    }
  }
};

// Display the current question and read it aloud
function showQuestion() {
  // Clear the answer input and set the placeholder
  const answerInput = document.getElementById('answerInput');
  answerInput.value = '';
  answerInput.placeholder = 'Enter your answer';

  document.getElementById('question').textContent = currentQuestion.question;
  readAloud(currentQuestion.question);

  // Process any pending voice answers
  if (userVoiceAnswer.trim() !== '') {
    document.getElementById('answerInput').value = userVoiceAnswer;
    processAnswer(); // Process the user's answer and display feedback
  }
}

function repeatQuestion() {
  const currentQuestionText = currentQuestion.question;
  readAloud(currentQuestionText);
}

// Process the user's answer
function processAnswer() {
  let userAnswer;
  if (userVoiceAnswer) {
    userAnswer = userVoiceAnswer.trim().toLowerCase();
    userVoiceAnswer = ''; // Clear the user's voice answer
  } else {
    userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
  }
  checkAnswer(userAnswer);
}

// Check if the user's answer is correct and display feedback 
function checkAnswer(userAnswer) {
  exp= currentQuestion.explanation;
  const feedbackDiv = document.getElementById('feedback');
  if (feedbackDiv) {
    feedbackDiv.remove();
  }

  const UserAnswer = userAnswer.toLowerCase();
  if (currentQuestion.answer == userAnswer) {
    displayFeedback("Correct! "+ exp);
  } else  {
    displayFeedback("Incorrect. "+ exp);
  }
}

// Display feedback on the screen and read it aloud
function displayFeedback(feedback) {
  const feedbackDiv = document.createElement('div');
  feedbackDiv.textContent = feedback;
  feedbackDiv.setAttribute('id', 'feedback');
  document.body.appendChild(feedbackDiv);
  readAloud(feedback);
}

const desiredVoiceLang = 'en-GB';
let selectedVoice;

// Set up voice selection when voices are available
speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  selectedVoice = voices.find(voice => voice.lang.startsWith(desiredVoiceLang)) || voices[0];
};


// Read the given text aloud using text-to-speech
function readAloud(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;

  if (selectedVoice) {
    speech.voice = selectedVoice;
    speechSynthesis.speak(speech);
  }
 }

// End the game
function endGame() {
  console.log("End game function called"); // Add this line for debugging
  document.getElementById('questionContainer').style.display = 'none';
  document.getElementById('gameOverContainer').style.display = 'block'; // Show the "Game Over" container
  readAloud("Game Over!");
  stopSpeechRecognition();
}


