// Sample database representing categories and answer-rarity scores (10 = common, 100 = rare)
const promptDatabase = [
    {
        prompt: "Name a continent",
        answers: { "asia": 10, "africa": 20, "europe": 30, "antarctica": 100 }
    },
    {
        prompt: "Name a primary color",
        answers: { "blue": 10, "red": 20, "yellow": 60 }
    },
    {
        prompt: "Name an ocean",
        answers: { "pacific": 10, "atlantic": 20, "indian": 50, "arctic": 80, "southern": 100 }
    }
];

let currentRound = 0;
let totalPoints = 0;
let timer;
let timeLeft = 25; // 25 seconds per prompt like the actual game

const promptText = document.getElementById("prompt-text");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const depthText = document.getElementById("depth");
const timerFill = document.getElementById("timer-fill");
const gameBox = document.getElementById("game-box");
const resultsScreen = document.getElementById("results-screen");

function startRound() {
    if (currentRound >= promptDatabase.length) {
        endGame();
        return;
    }
    
    answerInput.value = "";
    promptText.innerText = promptDatabase[currentRound].prompt;
    timeLeft = 25;
    updateTimerUI();
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft -= 0.1;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer(""); // Timeout fallback
        }
    }, 100);
}

function updateTimerUI() {
    const percentage = (timeLeft / 25) * 100;
    timerFill.style.width = `${percentage}%`;
}

function submitAnswer() {
    clearInterval(timer);
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentPrompt = promptDatabase[currentRound];
    
    let pointsEarned = 0;
    if (userAnswer in currentPrompt.answers) {
        pointsEarned = currentPrompt.answers[userAnswer];
    }

    totalPoints += pointsEarned;
    depthText.innerText = totalPoints * 10; // 1 point = 10 meters

    currentRound++;
    setTimeout(startRound, 1000); // 1-second delay between questions
}

function endGame() {
    gameBox.classList.add("hidden");
    resultsScreen.classList.remove("hidden");
    document.getElementById("final-depth").innerText = totalPoints * 10;
}

submitBtn.addEventListener("click", submitAnswer);
answerInput.addEventListener("keypress", (e) => { if (e.key === "Enter") submitAnswer(); });
document.getElementById("restart-btn").addEventListener("click", () => {
    currentRound = 0;
    totalPoints = 0;
    depthText.innerText = "0";
    gameBox.classList.remove("hidden");
    resultsScreen.classList.add("hidden");
    startRound();
});

// Kick off the game
startRound();
