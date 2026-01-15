// Cloud computing word dictionary with hints
const wordDatabase = [
    { word: "KUBERNETES", hint: "Container orchestration platform" },
    { word: "DOCKER", hint: "Containerization platform" },
    { word: "SERVERLESS", hint: "Architecture without server management" },
    { word: "MICROSERVICES", hint: "Architectural style with small services" },
    { word: "LAMBDA", hint: "AWS function-as-a-service" },
    { word: "AZURE", hint: "Microsoft's cloud platform" },
    { word: "TERRAFORM", hint: "Infrastructure as code tool" },
    { word: "JENKINS", hint: "Continuous integration server" },
    { word: "ANSIBLE", hint: "Configuration management tool" },
    { word: "CLOUDWATCH", hint: "AWS monitoring service" },
    { word: "ELASTICITY", hint: "Ability to scale resources" },
    { word: "DEVOPS", hint: "Development and operations integration" },
    { word: "CONTAINER", hint: "Isolated application environment" },
    { word: "VIRTUALIZATION", hint: "Creating virtual versions of resources" },
    { word: "SCALABILITY", hint: "Ability to handle growing workload" },
    { word: "LOAD", hint: "Balancer distributes traffic" },
    { word: "FIREWALL", hint: "Network security system" },
    { word: "KUBERNETES", hint: "K8s for short" },
    { word: "CICD", hint: "Continuous integration/deployment" },
    { word: "API", hint: "Application Programming Interface" },
    { word: "DATABASE", hint: "Organized data storage" },
    { word: "STORAGE", hint: "Data persistence layer" },
    { word: "COMPUTE", hint: "Processing power in the cloud" },
    { word: "NETWORK", hint: "Interconnected systems" },
    { word: "CLUSTER", hint: "Group of connected computers" },
    { word: "AUTOSCALING", hint: "Automatic resource adjustment" },
    { word: "DEPLOYMENT", hint: "Release of application" },
    { word: "MONITORING", hint: "System observation and tracking" },
    { word: "ENCRYPTION", hint: "Data security technique" },
    { word: "BACKUP", hint: "Data copy for recovery" },
    { word: "REDUNDANCY", hint: "Duplicate components for reliability" },
    { word: "AVAILABILITY", hint: "System uptime measure" },
    { word: "LATENCY", hint: "Time delay in data transfer" },
    { word: "THROUGHPUT", hint: "Data processing rate" },
    { word: "CACHING", hint: "Temporary data storage" },
    { word: "PROXY", hint: "Intermediary server" },
    { word: "GATEWAY", hint: "Entry/exit point for network" },
    { word: "ORCHESTRATION", hint: "Automated configuration management" },
    { word: "PIPELINE", hint: "Automated workflow stages" },
    { word: "ARTIFACT", hint: "Build output file" },
    { word: "REGISTRY", hint: "Container image repository" },
    { word: "NAMESPACE", hint: "Resource isolation boundary" },
    { word: "POD", hint: "Smallest Kubernetes unit" },
    { word: "NODE", hint: "Worker machine in cluster" },
    { word: "SERVICE", hint: "Stable network endpoint" },
    { word: "INGRESS", hint: "External access to services" },
    { word: "VOLUME", hint: "Persistent storage" },
    { word: "CONFIGMAP", hint: "Configuration data storage" },
    { word: "SECRET", hint: "Sensitive data storage" },
    { word: "HELM", hint: "Kubernetes package manager" }
];

// Game state
let currentWord = "";
let currentHint = "";
let guessedLetters = new Set();
let remainingAttempts = 6;
let gameOver = false;
let displayWord = [];

// DOM elements
const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const attemptsLeft = document.getElementById("attemptsLeft");
const lettersUsed = document.getElementById("lettersUsed");
const resultMessage = document.getElementById("resultMessage");
const shareSection = document.getElementById("shareSection");
const howToPlayModal = document.getElementById("howToPlayModal");
const winAnimation = document.getElementById("winAnimation");
const hintElement = document.getElementById("hint");
const toast = document.getElementById("toast");

// Hangman parts
const hangmanParts = [
    document.getElementById("head"),
    document.getElementById("body"),
    document.getElementById("leftArm"),
    document.getElementById("rightArm"),
    document.getElementById("leftLeg"),
    document.getElementById("rightLeg")
];

// Initialize keyboard
function initKeyboard() {
    keyboard.innerHTML = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    letters.forEach(letter => {
        const key = document.createElement("button");
        key.className = "key";
        key.textContent = letter;
        key.addEventListener("click", () => guessLetter(letter, key));
        keyboard.appendChild(key);
    });
}

// Start new game
function startNewGame() {
    // Reset game state
    const randomIndex = Math.floor(Math.random() * wordDatabase.length);
    const wordData = wordDatabase[randomIndex];
    currentWord = wordData.word;
    currentHint = wordData.hint;
    guessedLetters = new Set();
    remainingAttempts = 6;
    gameOver = false;
    displayWord = Array(currentWord.length).fill("_");

    // Reset UI
    updateWordDisplay();
    updateGameInfo();
    resultMessage.textContent = "";
    resultMessage.className = "result-message";
    shareSection.style.display = "none";
    hintElement.textContent = `💡 Hint: ${currentHint}`;
    
    // Reset hangman
    hangmanParts.forEach(part => part.style.display = "none");
    
    // Reset keyboard
    initKeyboard();
}

// Update word display
function updateWordDisplay() {
    wordDisplay.textContent = displayWord.join(" ");
}

// Update game info
function updateGameInfo() {
    attemptsLeft.textContent = remainingAttempts;
    lettersUsed.textContent = guessedLetters.size;
}

// Guess a letter
function guessLetter(letter, keyButton) {
    if (gameOver || guessedLetters.has(letter)) {
        return;
    }

    guessedLetters.add(letter);
    keyButton.disabled = true;

    if (currentWord.includes(letter)) {
        // Correct guess
        keyButton.classList.add("correct");
        
        // Reveal letter(s)
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) {
                displayWord[i] = letter;
            }
        }
        
        updateWordDisplay();
        
        // Check for win
        if (!displayWord.includes("_")) {
            winGame();
        }
    } else {
        // Incorrect guess
        keyButton.classList.add("incorrect");
        remainingAttempts--;
        
        // Show hangman part
        const partIndex = 6 - remainingAttempts - 1;
        if (partIndex >= 0 && partIndex < hangmanParts.length) {
            hangmanParts[partIndex].style.display = "block";
        }
        
        // Check for loss
        if (remainingAttempts === 0) {
            loseGame();
        }
    }

    updateGameInfo();
}

// Win game
function winGame() {
    gameOver = true;
    resultMessage.textContent = "🎉 Congratulations! You won!";
    resultMessage.className = "result-message win";
    shareSection.style.display = "block";
    
    // Trigger win animation
    triggerWinAnimation();
}

// Lose game
function loseGame() {
    gameOver = true;
    resultMessage.textContent = `😞 Game Over! The word was: ${currentWord}`;
    resultMessage.className = "result-message lose";
    shareSection.style.display = "block";
    
    // Reveal the word
    displayWord = currentWord.split("");
    updateWordDisplay();
}

// Trigger win animation
function triggerWinAnimation() {
    winAnimation.classList.add("active");
    
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = Math.random() * 100 + "%";
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + "s";
            confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
            winAnimation.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
    
    setTimeout(() => {
        winAnimation.classList.remove("active");
    }, 4000);
}

// Share results
function shareResults() {
    const gameUrl = window.location.href;
    const emoji = gameOver && !displayWord.includes("_") ? "🎉" : "😞";
    const status = gameOver && !displayWord.includes("_") ? "Won" : "Lost";
    const attemptsUsed = 6 - remainingAttempts;
    
    let shareText = `☁️ Cloud Computing Hangman ${emoji}\n\n`;
    shareText += `Status: ${status}\n`;
    shareText += `Word: ${currentWord}\n`;
    shareText += `Attempts used: ${attemptsUsed}/6\n`;
    shareText += `Letters guessed: ${guessedLetters.size}\n\n`;
    
    // Visual representation
    const attemptsEmoji = "❤️".repeat(remainingAttempts) + "🖤".repeat(6 - remainingAttempts);
    shareText += `${attemptsEmoji}\n\n`;
    shareText += `Play now: ${gameUrl}`;

    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast("✅ Results copied to clipboard!");
        }).catch(() => {
            fallbackCopy(shareText);
        });
    } else {
        fallbackCopy(shareText);
    }
}

// Fallback copy method
function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand("copy");
        showToast("✅ Results copied to clipboard!");
    } catch (err) {
        showToast("❌ Failed to copy results");
    }
    
    document.body.removeChild(textarea);
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("active");
    
    setTimeout(() => {
        toast.classList.remove("active");
    }, 3000);
}

// Event listeners
document.getElementById("newGameBtn").addEventListener("click", startNewGame);
document.getElementById("shareBtn").addEventListener("click", shareResults);
document.getElementById("howToPlayBtn").addEventListener("click", () => {
    howToPlayModal.classList.add("active");
});
document.getElementById("closeModalBtn").addEventListener("click", () => {
    howToPlayModal.classList.remove("active");
});

// Close modal when clicking outside
howToPlayModal.addEventListener("click", (e) => {
    if (e.target === howToPlayModal) {
        howToPlayModal.classList.remove("active");
    }
});

// Keyboard support
document.addEventListener("keydown", (e) => {
    if (gameOver) return;
    
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key) && !guessedLetters.has(key)) {
        const keyButton = Array.from(keyboard.children).find(btn => btn.textContent === key);
        if (keyButton && !keyButton.disabled) {
            guessLetter(key, keyButton);
        }
    }
});

// Start the game
startNewGame();