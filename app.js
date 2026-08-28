const STAGES = {
  1: {
    theme: "round1",
    color: "#00F3FF",
    title: "STAGE 1: KEYPAD NUMERIC LOCK",
    dialogue: '"Welcome Operator. Solve the Ohm\'s law equation to get the keypad passcode. Press # on the hardware keypad to submit."',
    question: "Calculate Voltage (V) when Current I = 5A and Resistance R = 12 Ohms.",
    answer: "60",
    fragment: "FRAG_1: 'THE VAULT'",
    label: "ENTERING CYBERPUNK TERMINAL"
  },
  2: {
    theme: "round2",
    color: "#00FF66",
    title: "STAGE 2: CAPACITIVE TOUCH MATRIX",
    dialogue: '"Bio-synthetic layer unlocked. Touch the correct sequence of capacitive wire nodes to complete the circuit path."',
    question: "Touch nodes in binary sequence for number 3 (Node 1 + Node 2).",
    answer: "TOUCH_3",
    fragment: "FRAG_2: 'HOLDS THE'",
    label: "ENTERING BIO-SYNTHETIC VAULT"
  },
  3: {
    theme: "round3",
    color: "#A855F7",
    title: "STAGE 3: LOGIC GATE MATRIX",
    dialogue: '"Dimensional shift complete. Toggle physical switches to satisfy the AND/OR gate condition."',
    question: "Set Inputs A and B to HIGH (1,1) to activate the output LED.",
    answer: "LOGIC_11",
    fragment: "FRAG_3: 'FINAL KEY'",
    label: "ENTERING QUANTUM VOID"
  },
  4: {
    theme: "round4",
    color: "#FFB800",
    title: "STAGE 4: ULTRASONIC ECHO CHAMBER",
    dialogue: '"Final security barrier. Hold your hand at exactly 15cm from the ultrasonic sensor to match the echo frequency."',
    question: "Maintain physical hand distance at 15 cm (Range: 14-16 cm).",
    answer: "DIST_15",
    fragment: "FRAG_4: 'TO FREEDOM'",
    label: "ENTERING SOLAR ECHO CORE"
  }
};

let currentRound = 1;

function initGame() {
  const stageData = STAGES[1];
  document.body.setAttribute("data-theme", stageData.theme);
  document.getElementById("stage-indicator").innerText = `ROUND 1 / 4`;
  document.getElementById("stage-title").innerText = stageData.title;
  document.getElementById("puzzle-question").innerText = stageData.question;
  document.getElementById("dialogue-box").innerText = stageData.dialogue;
}

function advanceToRound(nextRound) {
  if (nextRound > 4) {
    document.getElementById("dialogue-box").innerText = '"ALL FRAGMENTS DECRYPTED! Full Hidden Message: THE VAULT HOLDS THE FINAL KEY TO FREEDOM."';
    return;
  }

  const stageData = STAGES[nextRound];
  const portal = document.getElementById("portal-overlay");
  const portalText = document.getElementById("portal-text");

  portal.style.setProperty("--portal-color", stageData.color);
  portalText.innerText = stageData.label;
  portal.classList.add("active");

  setTimeout(() => {
    document.body.setAttribute("data-theme", stageData.theme);
    document.getElementById("stage-indicator").innerText = `ROUND ${nextRound} / 4`;
    document.getElementById("stage-title").innerText = stageData.title;
    document.getElementById("puzzle-question").innerText = stageData.question;
    document.getElementById("dialogue-box").innerText = stageData.dialogue;
    document.getElementById("live-input").innerText = "_";

    currentRound = nextRound;
  }, 1200);

  setTimeout(() => {
    portal.classList.remove("active");
  }, 2500);
}

function processHardwareInput(inputVal) {
  document.getElementById("live-input").innerText = inputVal;
  const currentStage = STAGES[currentRound];

  if (inputVal.trim() === currentStage.answer) {
    document.getElementById(`frag-${currentRound}`).innerText = currentStage.fragment;
    document.getElementById(`frag-${currentRound}`).style.color = currentStage.color;
    advanceToRound(currentRound + 1);
  }
}

// Dev bypass: Press 'N' to advance
document.addEventListener("keydown", (e) => {
  if (e.key === "n" || e.key === "N") {
    processHardwareInput(STAGES[currentRound].answer);
  }
});

// WEB SERIAL API INTEGRATION
let port;
let reader;

document.getElementById("connect-btn").addEventListener("click", async () => {
  if ("serial" in navigator) {
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      document.getElementById("hardware-status").innerText = "● ONLINE";
      document.getElementById("hardware-status").style.color = "#00ff66";
      document.getElementById("connect-btn").style.display = "none";

      readSerialData();
    } catch (err) {
      console.error("Serial connection failed:", err);
    }
  } else {
    alert("Web Serial API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
  }
});

async function readSerialData() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  reader = textDecoder.readable.getReader();

  let lineBuffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    if (value) {
      lineBuffer += value;
      let lines = lineBuffer.split("\n");
      lineBuffer = lines.pop();

      for (let line of lines) {
        let cleanInput = line.trim();
        if (cleanInput.length > 0) {
          processHardwareInput(cleanInput);
        }
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", initGame);
