const ARIA_SCRIPT = {
  boot: "TAP THE CHEST TO OPEN 🏴‍☠️",
  intro: "Whoa, whoa, hold your horses! You didn't think opening the ancient Vault of Knowledge would be that easy, did you? I’m Aria, guardian of what's inside. If you want this treasure, you've got to prove your worth across four hardware trials. Connect your USB device, and let's see what you've got!",
  connected: "Signal locked and hardware initialized! Let's see if that brain of yours is running at full clock speed.",
  failedConnect: "Connection dropped! I can't test your skills if your hardware isn't linked. Tap the chest and select your USB port!",
  mockery: {
    wrongKeypad: "Wait... did you punch that in with your eyes closed? Try calculating that again, genius!",
    guessing: "Ah, I see we're just pressing random numbers now. Bold strategy! Wrong, but bold.",
    touchFail: "My clock module measured that timing and almost fell asleep. Give me clean, deliberate taps!",
    wobble: "Whoa, shaky hands! Are you calibrating a sensor or waving goodbye? Keep your palm frozen!",
    stage4Fail: "Ouch! Stumbling right on the finish line? Take a deep breath, steady your hand, and try again!"
  },
  idle: {
    1: "The vault's security protocols aren't getting any younger! You still figuring out the math over there?",
    2: "The touch sensor module is right in front of you. Don't be shy, give it a tap!",
    3: "Logic evaluation twisting your brain? Punch your answer into the keypad and hit #!",
    4: "Are you measuring the distance with a ruler? Hover your hand at 15cm and let's move!"
  },
  victory: "Unbelievable! Calculated with absolute precision! You shattered all four heavy chains and unlocked the chest! You've earned every bit of this... here is the secret wisdom stored inside:"
};

const STAGES = {
  1: {
    theme: "round1",
    color: "#00F3FF",
    title: "STAGE 1: KEYPAD ENTRY",
    question: "Calculate Voltage (V) when Current I = 5A and Resistance R = 12 Ohms.",
    dialogue: "Stage 1 is live! Punch your calculated answer into the physical keypad followed by # to lock it in!",
    clue: "Stuck on the math? Use Ohm's Law: V = I × R (5 × 12 = 60). Key in '60' and press '#'.",
    answer: "60",
    fragment: "FRAG_1: 'THE VAULT'"
  },
  2: {
    theme: "round2",
    color: "#00FF66",
    title: "STAGE 2: TOUCH SENSOR TIMING",
    question: "Tap the physical TTP223 touch sensor module to send the signal.",
    dialogue: "Look at you, passing stage one like a natural! But don't get arrogant just yet... tap out the pattern on your TTP223 touch sensor!",
    clue: "Losing the rhythm? Press your finger cleanly against the TTP223 capacitive touch pad attached to GPIO 04.",
    answer: "TOUCH_3",
    fragment: "FRAG_2: 'HOLDS THE'"
  },
  3: {
    theme: "round3",
    color: "#A855F7",
    title: "STAGE 3: DIGITAL LOGIC EVALUATION",
    question: "Evaluate Boolean Statement: (TRUE AND FALSE) OR (NOT FALSE). Press 1 for True or 0 for False, then hit #.",
    dialogue: "Fast fingers, decent reflexes... not bad! Time to test your boolean logic. Evaluate the circuit condition and submit via keypad!",
    clue: "Logic twisting your brain? (TRUE AND FALSE) = 0. (NOT FALSE) = 1. So 0 OR 1 = 1. Punch '1' and hit '#'.",
    answer: "1",
    fragment: "FRAG_3: 'FINAL KEY'"
  },
  4: {
    theme: "round4",
    color: "#FFB800",
    title: "STAGE 4: ULTRASONIC DISTANCE LOCK",
    question: "Maintain physical hand distance at 15 cm from HC-SR04 (Target Range: 14-16 cm).",
    dialogue: "Impressive! You're standing right at the final magical barrier. Hover your palm steady at 15cm for 2 full seconds!",
    clue: "Hand shaking too much? Position your flat palm about 15cm (6 inches) away from the ultrasonic sensor eyes.",
    answer: "DIST_15",
    fragment: "FRAG_4: 'TO FREEDOM'"
  }
};

const QUOTES = [
  "\"The mind is not a vessel to be filled, but a fire to be kindled.\" — Plutarch",
  "\"Knowledge is power, but application is victory.\" — Vault Codex",
  "\"The only true wisdom is in knowing you know nothing.\" — Socrates"
];

let currentRound = 1;
let idleTimer = null;
let port;
let reader;

document.getElementById("vault-door").addEventListener("click", () => {
  if (!port) connectWebSerial();
});

document.getElementById("clue-btn").addEventListener("click", () => {
  if (STAGES[currentRound]) {
    document.getElementById("advice-text").innerText = STAGES[currentRound].clue;
  }
});

async function connectWebSerial() {
  if ("serial" in navigator) {
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      document.getElementById("hardware-status").innerText = "● ONLINE";
      document.getElementById("hardware-status").style.color = "#00ff66";
      document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.connected;
      document.getElementById("clue-btn").removeAttribute("disabled");

      setTimeout(() => { loadStage(1); }, 1500);
      readSerialData();
    } catch (err) {
      document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.failedConnect;
    }
  } else {
    alert("Web Serial is unsupported. Use Chrome or Edge.");
  }
}

function loadStage(stageNum) {
  currentRound = stageNum;
  const stageData = STAGES[stageNum];

  document.body.setAttribute("data-theme", stageData.theme);
  document.getElementById("stage-indicator").innerText = `ROUND ${stageNum} / 4`;
  document.getElementById("stage-title").innerText = stageData.title;
  document.getElementById("puzzle-question").innerText = stageData.question;
  document.getElementById("dialogue-box").innerText = stageData.dialogue;
  document.getElementById("advice-text").innerText = "Stuck on this stage? Click 💡 Request Clue if you need Aria's help!";
  document.getElementById("live-input").innerText = "_";

  resetIdleTimer();
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (ARIA_SCRIPT.idle[currentRound]) {
      document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.idle[currentRound];
    }
  }, 30000);
}

function advanceToRound(nextRound) {
  clearTimeout(idleTimer);
  const door = document.getElementById("vault-door");
  const lockCore = document.getElementById("lock-core");
  door.classList.add("open");
  lockCore.innerText = "UNLOCKED";

  setTimeout(() => {
    if (nextRound > 4) {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      document.getElementById("dialogue-box").innerText = `${ARIA_SCRIPT.victory}\n\n${randomQuote}`;
      return;
    }

    const stageData = STAGES[nextRound];
    const portal = document.getElementById("portal-overlay");
    const portalText = document.getElementById("portal-text");

    portal.style.setProperty("--portal-color", stageData.color);
    portalText.innerText = `ENTERING STAGE ${nextRound}`;
    portal.classList.add("active");

    setTimeout(() => {
      door.classList.remove("open");
      lockCore.innerText = "LOCKED";
      loadStage(nextRound);
    }, 1200);

    setTimeout(() => { portal.classList.remove("active"); }, 2500);
  }, 1000);
}

function processHardwareInput(inputVal) {
  resetIdleTimer();
  document.getElementById("live-input").innerText = inputVal;
  const currentStage = STAGES[currentRound];

  if (inputVal.trim() === currentStage.answer) {
    document.getElementById(`frag-${currentRound}`).innerText = currentStage.fragment;
    document.getElementById(`frag-${currentRound}`).style.color = currentStage.color;
    advanceToRound(currentRound + 1);
  } else {
    if (currentRound === 1) document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.mockery.wrongKeypad;
    if (currentRound === 2) document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.mockery.touchFail;
    if (currentRound === 3) document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.mockery.guessing;
    if (currentRound === 4) document.getElementById("dialogue-box").innerText = ARIA_SCRIPT.mockery.wobble;
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
        let cleanInput = line.trim();
        if (cleanInput.length > 0) processHardwareInput(cleanInput);
      }
    }
  }
}

// Dev key 'N' bypass
document.addEventListener("keydown", (e) => {
  if (e.key === "n" || e.key === "N") {
    if (STAGES[currentRound]) processHardwareInput(STAGES[currentRound].answer);
  }
});
