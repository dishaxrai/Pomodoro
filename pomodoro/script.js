
const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");
const messageDisplay = document.getElementById("message");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const breakTime = document.getElementById("breakTime");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let focusDuration = 25 * 60;
let remainingTime = focusDuration;
let timerInterval = null;
let isRunning = false;
let currentMode = "focus";

let completedSessions = 0;
let completedTasks = 0;

// Display the timer
function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}

// Start the timer
function startTimer() {
    if (isRunning) return;

    isRunning = true;
    messageDisplay.textContent = "You're doing great. Keep going!";
    timerInterval = setInterval(tick, 1000);
}

// Run every second
function tick() {
    remainingTime--;
    updateTimerDisplay();

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;

        if (currentMode === "focus") {
            completedSessions++;
            messageDisplay.textContent = "Focus session complete! Time for a break.";
            updateProgress();
            switchToBreak();
        } else {
            messageDisplay.textContent = "Break finished! Ready to focus again?";
            switchToFocus();
        }
    }
}

// Pause the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    messageDisplay.textContent = "Timer paused. Take your time.";
}

// Reset the timer to a fresh focus session
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    currentMode = "focus";
    remainingTime = focusDuration;

    modeDisplay.textContent = "Focus Session";
    messageDisplay.textContent = "One thing at a time.";
    startBtn.textContent = "Start";

    updateTimerDisplay();
}

// Switch to break mode
function switchToBreak() {
    currentMode = "break";
    remainingTime = Number(breakTime.value) * 60;

    modeDisplay.textContent = "Break Time";
    messageDisplay.textContent = "Stretch, breathe, grab a coffee.";
    updateTimerDisplay();
}

// Switch back to focus mode
function switchToFocus() {
    currentMode = "focus";
    remainingTime = focusDuration;

    modeDisplay.textContent = "Focus Session";
    messageDisplay.textContent = "One thing at a time.";
    updateTimerDisplay();
}

// Button events
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

// Update break length if the user changes it
breakTime.addEventListener("change", function () {
    if (currentMode === "break" && !isRunning) {
        remainingTime = Number(breakTime.value) * 60;
        updateTimerDisplay();
    }
});

// TO-DO LIST
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const taskItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const taskName = document.createElement("span");
    const deleteBtn = document.createElement("button");

    checkbox.type = "checkbox";
    taskName.textContent = taskText;
    deleteBtn.textContent = "×";
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("aria-label", "Delete task");

    checkbox.addEventListener("change", function () {
        taskItem.classList.toggle("done", checkbox.checked);

        completedTasks += checkbox.checked ? 1 : -1;
        updateProgress();
    });

    deleteBtn.addEventListener("click", function () {
        if (checkbox.checked) {
            completedTasks--;
        }

        taskItem.remove();
        updateProgress();
    });

    taskItem.append(checkbox, taskName, deleteBtn);
    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskInput.focus();

    updateProgress();
});

// PROGRESS TRACKER
function updateProgress() {
    document.getElementById("sessionCount").textContent =
        completedSessions;

    document.getElementById("focusTime").textContent =
        completedSessions * 25 + " min";

    document.getElementById("completedCount").textContent =
        completedTasks;

    document.getElementById("taskCount").textContent =
        completedTasks + " tasks completed";

    // Progress goal: 4 completed focus sessions
    const goal = 4;
    const percentage = Math.min(
        (completedSessions / goal) * 100,
        100
    );

    document.getElementById("progressBar").style.width =
        percentage + "%";

    const progressText = document.getElementById("progressText");

    if (completedSessions >= goal) {
        progressText.textContent = "Amazing! You've completed your daily focus goal.";
    } else {
        progressText.textContent =
            completedSessions + " of " + goal +
            " focus sessions completed.";
    }
}

// Initial display
updateTimerDisplay();
updateProgress();
