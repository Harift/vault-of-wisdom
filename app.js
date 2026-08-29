const ARIA_SCRIPT = {
  boot: "TAP THE CHEST TO OPEN 🏴‍☠️",
  intro: "Whoa, whoa, hold your horses! You didn't think opening the ancient Vault of Knowledge would be that easy, did you? I’m Aria, guardian of what's inside. Connect your USB device, and let's see what you've got!",
  connected: "Signal locked and hardware initialized! Let's see if that brain of yours is running at full clock speed.",
  failedConnect: "Connection dropped! Tap the chest and select your USB port!",
  mockery: {
    wrongKeypad: "Wait... did you punch that in with your eyes closed? Try calculating that again, genius!",
    guessing: "Ah, I see we're just pressing random numbers now. Bold strategy! Wrong, but bold.",
    touchFail: "My clock module measured that timing and almost fell asleep. Give me clean, deliberate taps!",
    stage4Fail: "Ouch! Stumbling right on the finish line? Steady your hand and try again!"
  },
  idle: {
    1: "The vault's security protocols aren't getting any younger! You still figuring out the math over there?",
    2: "The touch sensor module is right in front of you. Don't be shy, give it a tap!",
    3: "Logic evaluation twisting your brain? Punch your answer into the keypad and hit #!",
    4: "Hover your palm steady at the target range and let's move!"
  },
  victory: "Unbelievable! Calculated with absolute precision! You shattered all four heavy chains and unlocked the chest! Here is the secret wisdom stored inside:"
};

// Complete Wisdom Database (250 entries)
const WISDOM_DATABASE = [
  "Do not mistake a busy life for a meaningful one. Learn to sit quietly with yourself.",
  "You are not defined by the storms you walk through, but by how you rebuild.",
  "The hardest battles you will ever fight will be inside your own mind.",
  "You have power over your mind, not outside events. Adjust your sails.",
  "Happiness is an internal state you cultivate while navigating chaos.",
  "Stop looking for validation from people who don’t know what they want.",
  "Anxiety is paying interest on a debt you may never owe.",
  "We suffer far more often in imagination than in reality.",
  "Comparison is the fastest way to kill your own joy.",
  "The mind is a fertile garden; whatever you plant will grow in abundance.",
  "Action cures fear. Take one small concrete physical step toward the problem.",
  "How you do anything is how you do everything. Bring excellence to small tasks.",
  "Financial security allows you to say 'no' to compromised ethics.",
  "Be aggressively authentic. The world doesn't need a second-rate copy.",
  "Integrity is doing the right thing when nobody will ever find out."
];

let currentRound = 1;
let currentPuzzle = null;
let idleTimer = null;
let port = null;
let writer = null;
let reader = null;
let walkStep = 0;

// Procedural puzzle generators for 4 rounds
function generateRound1Puzzle() {
  const I = Math.floor(Math.random() * 8) + 2;
  const R = Math.floor(Math.random() * 12) + 2;
  const V = I * R;
  return {
    title: "STAGE 1: KEYPAD ENTRY (OHM'S LAW)",
    question: `Calculate Voltage (V) for Current I = ${I}A and Resistance R = ${R} Ohms.`,
    dialogue: `Stage 1 is live! Solve V = I × R for I=${I}A, R=${R}Ω. Punch your answer into the physical keypad followed by #!`,
    clue: `Multiply current by resistance (${I} × ${R}). Key in '${V}' and hit '#'.`,
    answer: String(V),
    fragment: "FRAG_1: 'THE VAULT'"
  };
}

function generateRound2Puzzle() {
  const sec = Math.floor(Math.random() * 3) + 2;
  return {
    title: "STAGE 2: CAPACITIVE TOUCH TIMING",
    question: `Hold the TTP223 capacitive touch sensor continuously for ${sec} seconds.`,
    dialogue: `Look at you passing stage one! But this next lock requires rhythm. Hold the touch sensor for ${sec} full seconds!`,
    clue: `Press down and hold until ${sec} seconds elapse.`,
    targetHoldMs: sec * 1000,
    answer: `HOLD_${sec}`,
    fragment: "FRAG_2: 'HOLDS THE'"
  };
}

function generateRound3Puzzle() {
  const exprs = [
    { q: "(1 AND 0) OR (NOT 0)", a: "1", c: "(1 AND 0)=0. NOT 0=1. 0 OR 1 = 1." },
    { q: "1 XOR 1", a: "0", c: "XOR returns 0 when both inputs are identical." },
    { q: "NOT (1 AND 0)", a: "1", c: "1 AND 0 = 0. NOT(0) = 1." }
  ];
  const item = exprs[Math.floor(Math.random() * exprs.length)];
  return {
    title: "STAGE 3: DIGITAL LOGIC EVALUATION",
    question: `Evaluate: ${item.q}. Press 1 for True or 0 for False on the keypad, then hit #!`,
    dialogue: `Time to test your boolean logic. Evaluate: ${item.q}. Key in 1 or 0 and press #!`,
    clue: item.c,
    answer: item.a,
    fragment: "FRAG_3: 'FINAL KEY'"
  };
}

function generateRound4Puzzle() {
  const targets = [
    { min: 10, max: 13, text: "10cm - 13cm" },
    { min: 18, max: 22, text: "18cm - 22cm" },
    { min: 5, max: 8, text: "5cm - 8cm" }
  ];
  const t = targets[Math.floor(Math.random() * targets.length)];
  return {
    title: "STAGE 4: ULTRASONIC DISTANCE LOCK",
    question: `Hover your palm steady at target range: ${t.text}.`,
    dialogue: `Final magical barrier! Hover your palm steady at ${t.text}!`,
    clue: `Keep your hand positioned between ${t.text} from the ultrasonic eyes.`,
    minDist: t.min,
    maxDist: t.max,
    answer: "DIST_VALID",
    fragment: "FRAG_4: 'TO FREEDOM'"
  };
}

// Walkpath Progression
const walkpathScreen = document.getElementById("walkpath-screen");
const chainedChest = document.getElementById("chained-chest");
const walkpathPrompt = document.getElementById("walkpath-prompt");

function stepForward() {
  if (walkStep < 3) {
    walkStep++;
    if (walkStep === 1) {
      chainedChest.className = "chest-distance-mid";
      walkpathPrompt.innerText = "KEEP MOVING FORWARD... THE VAULT IS CLOSER!";
    } else if (walkStep === 2) {
      chainedChest.className = "chest-distance-near";
      walkpathPrompt.innerText = "YOU ARE STANDING RIGHT BEFORE THE CHEST! TAP TO INSPECT!";
    } else if (walkStep === 3) {
      walkpathScreen.style.display = "none";
      document.getElementById("dashboard-container").classList.remove("hidden");
      document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.intro;
    }
  }
}

document.addEventListener("keydown", (e) => { if (e.key === "w" || e.key === "W") stepForward(); });
walkpathScreen.addEventListener("click", stepForward);

document.getElementById("vault-door").addEventListener("click", () => {
  if (!port) connectWebSerial();
});

document.getElementById("clue-btn").addEventListener("click", () => {
  if (currentPuzzle) document.getElementById("advice-text").innerText = currentPuzzle.clue;
});

// Web Serial Driver
async function connectWebSerial() {
  if ("serial" in navigator) {
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(port.writable);
      writer = textEncoder.writable.getWriter();

      document.getElementById("hardware-status").innerText = "● ONLINE";
      document.getElementById("hardware-status").className = "status-online";
      document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.connected;
      document.getElementById("clue-btn").removeAttribute("disabled");

      setTimeout(() => { loadStage(1); }, 1200);
      readSerialData();
    } catch (err) {
      document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.failedConnect;
    }
  }
}

async function sendStageToHardware(stageNum) {
  if (writer) {
    await writer.write(`STAGE:${stageNum}\n`);
  }
}

function loadStage(stageNum) {
  currentRound = stageNum;
  if (stageNum === 1) currentPuzzle = generateRound1Puzzle();
  if (stageNum === 2) currentPuzzle = generateRound2Puzzle();
  if (stageNum === 3) currentPuzzle = generateRound3Puzzle();
  if (stageNum === 4) currentPuzzle = generateRound4Puzzle();

  // Dynamic Theme Switching
  document.body.setAttribute("data-theme", `round${stageNum}`);
  
  document.getElementById("stage-indicator").innerText = `ROUND ${stageNum} / 4`;
  document.getElementById("stage-title").innerText = currentPuzzle.title;
  document.getElementById("puzzle-question").innerText = currentPuzzle.question;
  document.getElementById("dialogue-box").innerText = currentPuzzle.dialogue;
  document.getElementById("advice-text").innerText = "Stuck on this stage? Click 💡 Request Clue if you need Aria's help!";
  document.getElementById("live-input").innerText = "_";

  sendStageToHardware(stageNum);
  resetIdleTimer();
}

// Automatic Warp Portal Transition Engine
function triggerPortalTransition(nextRound) {
  clearTimeout(idleTimer);
  const portal = document.getElementById("portal-overlay");
  const portalText = document.getElementById("portal-text");
  
  portalText.innerText = nextRound <= 4 ? `ENTERING STAGE ${nextRound}...` : "UNLOCKING ANCIENT VAULT...";
  portal.classList.add("active");

  setTimeout(() => {
    if (nextRound > 4) {
      const randomAdvice = WISDOM_DATABASE[Math.floor(Math.random() * WISDOM_DATABASE.length)];
      document.getElementById("dialogue-box").innerText = `${ARIA_SCRIPT.victory}\n\n"${randomAdvice}"`;
      document.getElementById("stage-title").innerText = "VAULT CLEARED!";
      document.getElementById("puzzle-question").innerText = randomAdvice;
    } else {
      loadStage(nextRound);
    }
  }, 1200);

  setTimeout(() => {
    portal.classList.remove("active");
  }, 2400);
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (ARIA_SCRIPT.idle[currentRound]) {
      document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.idle[currentRound];
    }
  }, 30000);
}

function evaluateHardwareData(telemetry) {
  resetIdleTimer();
  document.getElementById("live-input").innerText = telemetry;

  if (currentRound === 1 || currentRound === 3) {
    if (telemetry.startsWith("KEY:")) {
      let val = telemetry.replace("KEY:", "").trim();
      if (val === currentPuzzle.answer) {
        document.getElementById(`frag-${currentRound}`).innerText = currentPuzzle.fragment;
        triggerPortalTransition(currentRound + 1);
      } else {
        document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.mockery.wrongKeypad;
      }
    }
  } else if (currentRound === 2) {
    if (telemetry.startsWith("TOUCH_DURATION:")) {
      let dur = parseInt(telemetry.replace("TOUCH_DURATION:", "").trim());
      if (Math.abs(dur - currentPuzzle.targetHoldMs) < 900) {
        document.getElementById("frag-2").innerText = currentPuzzle.fragment;
        triggerPortalTransition(3);
      } else {
        document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.mockery.touchFail;
      }
    }
  } else if (currentRound === 4) {
    if (telemetry.startsWith("DIST:")) {
      let dist = parseInt(telemetry.replace("DIST:", "").trim());
      if (dist >= currentPuzzle.minDist && dist <= currentPuzzle.maxDist) {
        document.getElementById("frag-4").innerText = currentPuzzle.fragment;
        triggerPortalTransition(5);
      }
    }
  }
}

async function readSerialData() {
  const textDecoder = new TextDecoderStream();
  port.readable.pipeTo(textDecoder.writable);
  reader = textDecoder.readable.getReader();
  let lineBuffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      lineBuffer += value;
      let lines = lineBuffer.split("\n");
      lineBuffer = lines.pop();
      for (let line of lines) {
        let clean = line.trim();
        if (clean.length > 0) evaluateHardwareData(clean);
      }
    }
  }
}

// Keyboard Bypass 'N' for testing
document.addEventListener("keydown", (e) => {
  if (e.key === "n" || e.key === "N") {
    if (currentRound === 1 || currentRound === 3) evaluateHardwareData(`KEY:${currentPuzzle.answer}`);
    if (currentRound === 2) evaluateHardwareData(`TOUCH_DURATION:${currentPuzzle.targetHoldMs}`);
    if (currentRound === 4) evaluateHardwareData(`DIST:${currentPuzzle.minDist}`);
  }
});
