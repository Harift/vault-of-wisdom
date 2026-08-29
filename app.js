let port, reader, writer;
let currentRound = 1;
let currentPuzzle = {};
let currentAnswerBuffer = "";

const ARIA_SCRIPT = {
  mockery: {
    touchFail: "Timing missed! Keep steady pressure for the full duration.",
    wrongKeypad: "Incorrect key entry! Math not matching up?"
  }
};

function generateRound1Puzzle() {
  const i = Math.floor(Math.random() * 5) + 2;
  const r = Math.floor(Math.random() * 8) + 5;
  return {
    title: "STAGE 1: KEYPAD ENTRY (OHM'S LAW)",
    question: `Calculate Voltage (V) for Current I = ${i}A and Resistance R = ${r} Ohms.`,
    dialogue: `Stage 1 live! Calculate V = I * R for I=${i}A, R=${r}Ω. Punch your answer into the keypad or web box and click Check!`,
    answer: i * r,
    fragment: "VOLT"
  };
}

function generateRound2Puzzle() {
  return {
    title: "STAGE 2: TOUCH SENSOR TIMING",
    question: "Touch and hold the metal sensor for exactly 3 seconds.",
    dialogue: "Hold the sensor down! Release after 3 seconds.",
    targetHoldMs: 3000,
    fragment: "TIME"
  };
}

function generateRound3Puzzle() {
  return {
    title: "STAGE 3: LOGIC EVALUATION",
    question: "Evaluate Binary Logic: (1 AND 1) OR (0 AND 1). Enter 1 for True, 0 for False.",
    dialogue: "Boolean time! What does (1 AND 1) OR (0 AND 1) evaluate to?",
    answer: 1,
    fragment: "GATE"
  };
}

function generateRound4Puzzle() {
  return {
    title: "STAGE 4: ULTRASONIC DISTANCE",
    question: "Place your hand at a distance between 10cm and 15cm from the sensor.",
    dialogue: "Target depth range detected. Move your hand to 10-15cm away from the sonar.",
    minDist: 10,
    maxDist: 15,
    fragment: "WAVE"
  };
}

function sendLCDText(line1, line2) {
  if (writer) {
    let safeL1 = line1.replace(/[^\x20-\x7E]/g, "").substring(0, 16);
    let safeL2 = line2.replace(/[^\x20-\x7E]/g, "").substring(0, 16);
    writer.write(`LCD:${safeL1}|${safeL2}\n`);
  }
}

function sendStageToHardware(stageNum) {
  if (writer) {
    writer.write(`STAGE:${stageNum}\n`);
  }
}

function updateInputUI(value) {
  currentAnswerBuffer = value;
  const inputEl = document.getElementById("answer-input");
  if (inputEl) inputEl.value = currentAnswerBuffer;

  if (currentRound === 1 || currentRound === 3) {
    sendLCDText(`STAGE ${currentRound}: ENTRY`, `> ${currentAnswerBuffer || "_____"}`);
  }
}

function clearInput() {
  updateInputUI("");
  document.getElementById("dialogue-box").innerText = "Input cleared! Re-enter your answer.";
  sendStageToHardware(currentRound);
}

function showTreasureClearance() {
  const modal = document.getElementById("treasure-modal");
  const chest = document.getElementById("treasure-chest");
  const prompt = document.getElementById("chest-prompt");
  const restartBtn = document.getElementById("restart-btn");

  if (!modal || !chest) return;

  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("active"), 50);
  chest.classList.remove("open");
  prompt.innerText = "TAP THE CHEST TO CLAIM THE WISDOM";
  prompt.style.display = "block";
  restartBtn.classList.add("hidden");

  sendLCDText("VAULT UNLOCKED!", "WISDOM GRANTED");

  chest.onclick = () => {
    if (!chest.classList.contains("open")) {
      chest.classList.add("open");
      prompt.style.display = "none";
      setTimeout(() => {
        restartBtn.classList.remove("hidden");
      }, 1200);
    }
  };

  restartBtn.onclick = () => {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.classList.add("hidden");
      loadStage(1);
    }, 600);
  };
}

function triggerPortalTransition(nextStage) {
  if (nextStage > 4) {
    document.getElementById("dialogue-box").innerText = "🎉 All vault security doors unlocked!";
    showTreasureClearance();
    return;
  }
  loadStage(nextStage);
}

function loadStage(stageNum) {
  currentRound = stageNum;
  if (stageNum === 1) currentPuzzle = generateRound1Puzzle();
  if (stageNum === 2) currentPuzzle = generateRound2Puzzle();
  if (stageNum === 3) currentPuzzle = generateRound3Puzzle();
  if (stageNum === 4) currentPuzzle = generateRound4Puzzle();

  document.body.setAttribute("data-theme", `round${stageNum}`);
  document.getElementById("stage-indicator").innerText = `STAGE: ROUND ${stageNum} / 4`;
  document.getElementById("stage-title").innerText = currentPuzzle.title;
  document.getElementById("puzzle-question").innerText = currentPuzzle.question;
  document.getElementById("dialogue-box").innerText = currentPuzzle.dialogue;

  sendStageToHardware(stageNum);
  updateInputUI("");
}

function checkAnswer() {
  const userVal = currentAnswerBuffer.trim();

  if (!userVal) {
    document.getElementById("dialogue-box").innerText = "⚠️ Please enter a value before checking!";
    return;
  }

  if (currentRound === 1 || currentRound === 3) {
    if (userVal === String(currentPuzzle.answer)) {
      document.getElementById(`frag-${currentRound}`).innerText = currentPuzzle.fragment;
      updateInputUI("");
      triggerPortalTransition(currentRound + 1);
    } else {
      document.getElementById("dialogue-box").innerText = `❌ ${userVal} is incorrect! Resetting screen...`;
      sendLCDText("INCORRECT VALUE!", "TRY AGAIN...");

      setTimeout(() => {
        clearInput();
      }, 1500);
    }
  }
}

function evaluateHardwareData(telemetry) {
  let cleanData = telemetry.replace(/[^\x20-\x7E]/g, '').trim();
  document.getElementById("live-input").innerText = cleanData;

  if (currentRound === 1 || currentRound === 3) {
    if (cleanData.includes("KEY:")) {
      let val = cleanData.substring(cleanData.indexOf("KEY:") + 4).trim();
      updateInputUI(val);
      checkAnswer();
    }
  } else if (currentRound === 2) {
    if (cleanData.includes("TOUCH_DURATION:")) {
      let dur = parseInt(cleanData.substring(cleanData.indexOf("TOUCH_DURATION:") + 15).trim());
      if (Math.abs(dur - currentPuzzle.targetHoldMs) < 900) {
        document.getElementById("frag-2").innerText = currentPuzzle.fragment;
        triggerPortalTransition(3);
      } else {
        document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.mockery.touchFail;
        sendLCDText("TIMING FAILED!", "TRY HOLDING AGAIN");
        setTimeout(() => { sendStageToHardware(2); }, 1500);
      }
    }
  } else if (currentRound === 4) {
    if (cleanData.includes("DIST:")) {
      let dist = parseInt(cleanData.substring(cleanData.indexOf("DIST:") + 5).trim());
      if (dist >= currentPuzzle.minDist && dist <= currentPuzzle.maxDist) {
        document.getElementById("frag-4").innerText = currentPuzzle.fragment;
        triggerPortalTransition(5);
      }
    }
  }
}

async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const encoder = new TextEncoderStream();
    encoder.readable.pipeTo(port.writable);
    writer = encoder.writable.getWriter();

    document.getElementById("connection-status").innerText = "• ONLINE";
    document.getElementById("connection-status").className = "status-indicator online";

    loadStage(1);

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let lines = buffer.split("\n");
      buffer = lines.pop();
      for (let line of lines) {
        evaluateHardwareData(line);
      }
    }
  } catch (err) {
    console.error("Serial connection failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connect-btn").addEventListener("click", connectSerial);
  document.getElementById("check-btn").addEventListener("click", checkAnswer);
  document.getElementById("clear-btn").addEventListener("click", clearInput);

  const answerInput = document.getElementById("answer-input");
  if (answerInput) {
    answerInput.addEventListener("input", (e) => {
      updateInputUI(e.target.value);
    });
    answerInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkAnswer();
    });
  }

  loadStage(1);
});
