let port, reader, writer;
let currentRound = 1;
let currentPuzzle = {};
let currentAnswerBuffer = "";

// 250 ADVICE DATABASE
const ADVICE_DATABASE = [
  "Anxiety is paying interest on a debt you may never owe.",
  "Simplify before you optimize.",
  "Measure twice, cut once.",
  "Small daily improvements over time lead to stunning results.",
  "Fail early, fail often, learn faster.",
  "The best error message is the one that never shows up.",
  "Focus on process over outcome.",
  "Done is better than perfect.",
  "Action cures fear; delay breeds doubt.",
  "Consistency beats intensity every single time.",
  "If you can't explain it simply, you don't understand it well enough.",
  "Your direction is more important than your speed.",
  "Master the fundamentals before chasing complexity.",
  "Clear thinking requires quiet time.",
  "Fix the cause, not the symptom.",
  "Patience is passion tamed by discipline.",
  "Doubt is removed by action, not by thought.",
  "Knowledge is knowing a tomato is a fruit; wisdom is not putting it in a fruit salad.",
  "Build modularly so one broken piece doesn't break everything.",
  "Don't comment bad code — rewrite it.",
  "Premature optimization is the root of all evil.",
  "Assume nothing, test everything.",
  "Great things are done by a series of small things brought together.",
  "The secret to getting ahead is getting started.",
  "A problem well-stated is a problem half-solved.",
  "Make it work, make it right, make it fast — in that exact order.",
  "Experience is simply the name we give our mistakes.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Work smarter, not harder, but don't avoid hard work.",
  "Do one thing and do it exceptionally well.",
  "Be curious, not judgmental.",
  "You don't have to be extreme, just consistent.",
  "Rest when you're tired, don't quit.",
  "Stay hungry, stay foolish.",
  "First principles thinking solves hard problems faster.",
  "Attention to detail separates good from great.",
  "A bug found early is a fortune saved late.",
  "Never let a stumble be the end of your journey.",
  "Learn from the mistakes of others; you can't live long enough to make them all yourself.",
  "Quality is not an act, it is a habit.",
  "Choose clarity over cleverness.",
  "Every system is perfectly designed to get the results it gets.",
  "Change the approach, not the goal.",
  "The mind is like a parachute; it works best when open.",
  "Focus on being productive instead of busy.",
  "Confidence comes from competence built through practice.",
  "If it isn't documented, it doesn't exist.",
  "Write code for humans first, machines second.",
  "You cannot manage what you do not measure.",
  "Continuous learning is the minimum requirement for success.",
  "The only real mistake is the one from which we learn nothing.",
  "Discipline is choosing between what you want now and what you want most.",
  "Small leaks sink great ships.",
  "Control what you can control, let go of what you can't.",
  "Simplicity is the ultimate sophistication.",
  "Don't let yesterday take up too much of today.",
  "Look for solutions, not excuses.",
  "Iterate rapidly, refine continuously.",
  "Feedback is the breakfast of champions.",
  "You don't need a silver bullet, you need a steady process.",
  "Think twice, code once.",
  "A wise person adapts to the world; an unwise person expects the world to adapt.",
  "Energy flows where attention goes.",
  "Great systems make good habits automatic.",
  "Never compromise on core standards.",
  "Mistakes are proof that you are trying.",
  "What gets scheduled gets done.",
  "Your future is created by what you do today, not tomorrow.",
  "Seek feedback, not validation.",
  "When in doubt, break it down into smaller steps.",
  "Structure brings freedom.",
  "The cost of fixing a bug rises exponentially over time.",
  "Always leave code cleaner than you found it.",
  "It always seems impossible until it's done.",
  "Don't re-invent the wheel unless you intend to learn how wheels work.",
  "True mastery is taking complex ideas and making them effortless.",
  "Stay calm in high-entropy situations.",
  "To go fast, go alone. To go far, go together.",
  "Keep your balance between theory and application.",
  "Challenge your assumptions daily.",
  "A clear mind leads to clean execution.",
  " do not fear failure; fear standing still.",
  "The best way to predict the future is to create it.",
  "One good habit can anchor a dozen others.",
  "Perfection is achieved not when there is nothing more to add, but when nothing left to take away.",
  "Be stubborn on vision, flexible on details.",
  "Courage is resistance to fear, mastery of fear — not absence of fear.",
  "Automation without strategy is just automated chaos.",
  "Focus is saying no to 1,000 good ideas.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't count the days, make the days count.",
  "The expert in anything was once a beginner.",
  "Logic gets you from A to B; imagination takes you everywhere.",
  "Build strong foundations before raising high towers.",
  "Work in public, learn in public.",
  "A smooth sea never made a skilled sailor.",
  "Guard your focus like your most valuable resource.",
  "Complexity is the enemy of execution.",
  "Be quick, but don't hurry.",
  "Turn every obstacle into an opportunity.",
  "Prioritize ruthlessly.",
  "Good habits are hard to form but easy to live with.",
  "Never mistake motion for progress.",
  "You learn more from failure than success.",
  "The best time to plant a tree was 20 years ago; the second best time is now.",
  "A goal without a plan is just a wish.",
  "Think long term, act short term.",
  "The sharpest tool gets dull without maintenance.",
  "Always test edge cases.",
  "Don't optimize what shouldn't exist in the first place.",
  "Creativity thrives within constraints.",
  "Focus on inputs, and outputs will take care of themselves.",
  "You are what you repeatedly do.",
  "Doubt kills more dreams than failure ever will.",
  "Build tools that multiply human potential.",
  "Every line of code is a liability, not an asset.",
  "To solve a big problem, solve ten smaller ones.",
  "Adaptability is the ultimate survival trait.",
  "Keep your momentum alive.",
  "Curiosity is the engine of achievement.",
  "Reframing the question often reveals the answer.",
  "Treat root causes, not superficial symptoms.",
  "The road to wisdom is paved with iterations.",
  "Resilience is built in tough moments.",
  "A good system beats willpower every time.",
  "Small details make big impressions.",
  "Never underestimate the power of a fresh perspective.",
  "Stay grounded when winning, stay steady when losing.",
  "Clear goals remove decision fatigue.",
  "The most valuable asset is uninterrupted time.",
  "Be willing to be a beginner every single day.",
  "Excellence is a habit, not an event.",
  "Listen more than you speak.",
  "Make decisions based on data, not emotion.",
  "Speed comes from elimination of friction.",
  "Value utility over appearance.",
  "True confidence is quiet; insecurity is loud.",
  "Keep learning, keep building, keep sharing.",
  "Plan for failure to guarantee success.",
  "Small steps forward are still steps forward.",
  "Don't fear hard problems; they hold the greatest value.",
  "Patience with results, impatience with actions.",
  "Great solutions look obvious in hindsight.",
  "Your habits shape your identity.",
  "Maintain high signal-to-noise ratio in work and life.",
  "Never stop refining your craft.",
  "The best shortcut is taking the long way with discipline.",
  "Focus on impact, not activity.",
  "Measure progress by value delivered.",
  "Stay flexible in approach, firm in principles.",
  "Invention requires a willingness to be misunderstood.",
  "Build with empathy for the user.",
  "Wisdom is knowing what to ignore.",
  "Every constraint is a hidden advantage.",
  "Solve for tomorrow, deliver for today.",
  "Execution turns ideas into reality.",
  "Stay humble, stay persistent.",
  "Small improvements compound like interest.",
  "Focus on mastery, not applause.",
  "Clarity of thought produces clarity of action.",
  "A calm mind sees solutions clearly.",
  "Never rush critical steps.",
  "Good design makes complex tasks simple.",
  "Seek understanding before seeking agreement.",
  "Turn noise into signal.",
  "Preparation meets opportunity.",
  "Don't build for hypothetical scenarios.",
  "Maintain your standards when nobody is watching.",
  "Consistency creates momentum.",
  "Learn the rules so you know how to break them effectively.",
  "The best feedback is rapid usage data.",
  "Make hard choices early to avoid painful outcomes late.",
  "Keep your tools sharp and your workspace clean.",
  "Focus on depth over breadth.",
  "Every failure is a data point.",
  "Protect your energy, direct your focus.",
  "Value truth over comfort.",
  "Simple solutions endure longer.",
  "Build iteratively and get feedback early.",
  "Mastery requires deliberate practice.",
  "Don't let perfection hold back progress.",
  "Your environment dictates your defaults.",
  "Think clearly, speak concisely, act decisively.",
  "Focus on solving real problems.",
  "Stay grounded in fundamentals.",
  "Good judgment comes from experience.",
  "Make complex ideas easy to digest.",
  "Patience is key to solving tough engineering problems.",
  "Work with conviction and humility.",
  "Eliminate distraction to uncover focus.",
  "Never stop asking 'why'.",
  "Great ideas mean nothing without execution.",
  "Small wins fuel big breakthroughs.",
  "The fastest code is the code that doesn't run.",
  "Focus on quality and speed will follow.",
  "Build systems that scale gracefully.",
  "Choose long-term growth over short-term comfort.",
  "Stay open to changing your mind when given new data.",
  "The quietest voice in the room often has the best point.",
  "Never underestimate steady, daily effort.",
  "Strive for balance, achieve through discipline.",
  "Keep your momentum, protect your focus.",
  "True innovation simplifies life.",
  "Learn to embrace ambiguity.",
  "Focus on building value that lasts.",
  "Action resolves anxiety.",
  "Think before you execute.",
  "Respect the process and trust the outcome.",
  "Continuous effort turns challenge into growth.",
  "A disciplined mind creates a peaceful life.",
  "Simplicity requires deep thought.",
  "Focus on what truly matters.",
  "Never trade long-term trust for short-term gain.",
  "Great achievements require quiet determination.",
  "Keep moving forward, one step at a time.",
  "Stay resilient through unexpected challenges.",
  "Focus, build, refine, repeat.",
  "Wisdom begins with self-awareness.",
  "Value progress over perfection every single day.",
  "Small adjustments yield massive outcomes.",
  "Stay patient, stay disciplined, stay focused.",
  "Build with purpose and precision.",
  "True strength is calm under pressure.",
  "Learn constantly, adapt swiftly.",
  "Every challenge contains its own solution.",
  "Keep your eyes on the goal, not the obstacles.",
  "Focus on long-term value, not momentary hype.",
  "Quiet effort yields loud results.",
  "Master your craft through repetition and feedback.",
  "Stay true to core principles.",
  "Simplicity is key to durability.",
  "Focus on solutions, embrace iteration.",
  "Build software like architecture — sturdy and elegant.",
  "Persist until the code works smoothly.",
  "Clear mind, steady hand, sharp execution.",
  "Wisdom grows when you share knowledge freely.",
  "Every problem solved is a foundation for the next achievement."
];

const ARIA_SCRIPT = {
  mockery: [
    "Is your processor running on 8-bit math? Try again!",
    "Calculations offline. Did you skip physics class?",
    "My neural circuits are cringing at that attempt.",
    "Timing missed! A tortoise has better hold precision.",
    "Hand out of range! Are you measuring with your eyes closed?",
    "Incorrect! Even a simple 555 timer chip gets this right."
  ],
  praise: [
    "Acceptable... for a biological unit.",
    "Precision verified! Moving to next security layer.",
    "Calculated with surprising efficiency!",
    "Decryption successful. Don't celebrate too early."
  ]
};

function getRandomMockery() {
  return ARIA_SCRIPT.mockery[Math.floor(Math.random() * ARIA_SCRIPT.mockery.length)];
}

function getRandomPraise() {
  return ARIA_SCRIPT.praise[Math.floor(Math.random() * ARIA_SCRIPT.praise.length)];
}

function getRandomAdvice() {
  return ADVICE_DATABASE[Math.floor(Math.random() * ADVICE_DATABASE.length)];
}

// STAGE PUZZLE GENERATORS (Clues only give formulas!)
function generateRound1Puzzle() {
  const i = Math.floor(Math.random() * 5) + 2;
  const r = Math.floor(Math.random() * 8) + 5;
  return {
    title: "STAGE 1: KEYPAD ENTRY (OHM'S LAW)",
    question: `Calculate Voltage (V) for Current I = ${i}A and Resistance R = ${r} Ohms.`,
    dialogue: `Stage 1 active! Calculate V = I * R for I = ${i}A and R = ${r}Ω. Enter answer on keypad or web input!`,
    answer: i * r,
    clue: "Formula: Voltage (V) = Current (I) × Resistance (R)",
    fragment: "VOLT"
  };
}

function generateRound2Puzzle() {
  const mult = Math.floor(Math.random() * 3) + 2; // 2 to 4
  const base = Math.floor(Math.random() * 3) + 1; // 1 to 3
  const targetSec = mult + base;
  
  return {
    title: "STAGE 2: TOUCH TIMING EQUATION",
    question: `Solve for X (seconds): X = (${mult * 2} / 2) + ${base}. Hold or tap the sensor for exactly X seconds!`,
    dialogue: `Solve the equation to find hold duration X in seconds. Hold the touch sensor for exactly X seconds!`,
    targetHoldMs: targetSec * 1000,
    targetSec: targetSec,
    clue: "Formula: X = (A / 2) + B. Evaluate division inside parentheses first, then add the constant B.",
    fragment: "TIME"
  };
}

function generateRound3Puzzle() {
  return {
    title: "STAGE 3: LOGIC EVALUATION",
    question: "Evaluate Binary Logic: (1 AND 1) OR (0 AND 1). Enter 1 for True, 0 for False.",
    dialogue: "Boolean time! Solve (1 AND 1) OR (0 AND 1). Enter 1 or 0.",
    answer: 1,
    clue: "Formula: (A AND B) = 1 only if both inputs are 1. (A OR B) = 1 if at least one input is 1.",
    fragment: "GATE"
  };
}

function generateRound4Puzzle() {
  const useInches = Math.random() > 0.5;
  let minCm, maxCm, questionText, clueText;

  if (useInches) {
    const minIn = 4;
    const maxIn = 6;
    minCm = Math.round(minIn * 2.54);
    maxCm = Math.round(maxIn * 2.54);
    questionText = `Target Distance Range: Between ${minIn} inches and ${maxIn} inches. Convert to cm and position your hand!`;
    clueText = "Formula: Distance in Centimeters (cm) = Distance in Inches (in) × 2.54";
  } else {
    const minDm = 1;
    const maxDm = 1.5;
    minCm = Math.round(minDm * 10);
    maxCm = Math.round(maxDm * 10);
    questionText = `Target Distance Range: Between ${minDm} dm and ${maxDm} dm. Convert to cm and position your hand!`;
    clueText = "Formula: Distance in Centimeters (cm) = Distance in Decimeters (dm) × 10";
  }

  return {
    title: "STAGE 4: ULTRASONIC CONVERSION",
    question: questionText,
    dialogue: "Convert measurement to centimeters, then position your hand in front of the ultrasonic sensor!",
    minDist: minCm,
    maxDist: maxCm,
    clue: clueText,
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
  document.getElementById("dialogue-box").innerText = "Input cleared! Re-calculate your formula.";
  sendStageToHardware(currentRound);
}

// TREASURE CHEST DISPLAY (Random advice on click)
function showTreasureClearance() {
  const modal = document.getElementById("treasure-modal");
  const chest = document.getElementById("treasure-chest");
  const prompt = document.getElementById("chest-prompt");
  const restartBtn = document.getElementById("restart-btn");
  const wisdomQuote = document.querySelector(".wisdom-quote");

  if (!modal || !chest) return;

  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("active"), 50);
  chest.classList.remove("open");
  prompt.innerText = "TAP THE CHEST TO UNLOCK THE ANCIENT WISDOM";
  prompt.style.display = "block";
  restartBtn.classList.add("hidden");

  sendLCDText("VAULT UNLOCKED!", "WISDOM GRANTED");

  chest.onclick = () => {
    if (!chest.classList.contains("open")) {
      // Pick random advice from 250 database array
      if (wisdomQuote) {
        wisdomQuote.innerText = `"${getRandomAdvice()}"`;
      }
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

// PORTAL TRANSITION ANIMATION BETWEEN STAGES
function triggerPortalTransition(nextStage) {
  let portalOverlay = document.getElementById("portal-transition-overlay");
  
  if (!portalOverlay) {
    portalOverlay = document.createElement("div");
    portalOverlay.id = "portal-transition-overlay";
    portalOverlay.className = "portal-transition-overlay";
    document.body.appendChild(portalOverlay);
  }

  // Trigger warp animation
  portalOverlay.classList.add("active");

  setTimeout(() => {
    if (nextStage > 4) {
      document.getElementById("dialogue-box").innerText = "🎉 " + getRandomPraise() + " All security locks cleared!";
      showTreasureClearance();
    } else {
      document.getElementById("dialogue-box").innerText = "✨ " + getRandomPraise();
      loadStage(nextStage);
    }
  }, 500);

  setTimeout(() => {
    portalOverlay.classList.remove("active");
  }, 1000);
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
  document.getElementById("clue-text").innerText = "Stuck on this stage? Click Request Clue to see formula guidance!";

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
      const mockery = getRandomMockery();
      document.getElementById("dialogue-box").innerText = `❌ ${mockery}`;
      sendLCDText("WRONG ENTRY!", "TRY AGAIN...");

      setTimeout(() => {
        clearInput();
      }, 1600);
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
      if (Math.abs(dur - currentPuzzle.targetHoldMs) <= 900) {
        document.getElementById("frag-2").innerText = currentPuzzle.fragment;
        triggerPortalTransition(3);
      } else {
        const mockery = getRandomMockery();
        document.getElementById("dialogue-box").innerText = `❌ Held for ${(dur/1000).toFixed(1)}s. ${mockery}`;
        sendLCDText("TIMING FAILED!", "RETRY HOLD...");
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
  
  document.getElementById("clue-btn").addEventListener("click", () => {
    if (currentPuzzle.clue) {
      document.getElementById("clue-text").innerText = currentPuzzle.clue;
    }
  });

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
