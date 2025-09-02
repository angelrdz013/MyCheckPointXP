const terminal = document.getElementById("terminal");
const btnInicial = document.getElementById("startInicial");
const btnEmocional = document.getElementById("startEmocional");

let step = 0;
let answers = {};
let currentFlow = "";

const dailyPhrases = [
  "🎯 Hoy también cuenta.",
  "💪 Tu disciplina le está ganando al caos.",
  "🧘‍♀️ Tu mente es tu casa. Límpiala con intención.",
  "🕹️ Cada día es un nuevo nivel. ¡Presiona Start!",
  "🚀 No tienes que hacerlo perfecto. Solo avanzar.",
];
const emotionalPhrases = [
  "Recuerda que tu mente también merece un respiro.",
  "Tu energía marca el ritmo de tu día.",
  "Cada pausa intencional es una victoria silenciosa.",
  "Hazlo por ti. Hazlo ahora.",
  "Hoy es un buen día para ganar XP emocional.",
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Preguntas
const flows = {
  inicial: [
    { key: "intencion", text: "📌 ¿Cuál es tu intención para hoy?" },
    { key: "reto", text: "🎯 ¿Cuál será tu reto personal/profesional?" }
  ],
  emocional: [
    { key: "emocion", text: "🧠 ¿Cómo te sientes ahora?" },
    { key: "razon", text: "🤔 ¿Por qué te sientes así?" },
    { key: "consejo", text: "🤝 Un amigo dice eso... ¿Qué consejo le das?" }
  ]
};

// Utilidades
function printLine(text, color = "#0f0") {
  const line = document.createElement("div");
  line.style.color = color;
  line.textContent = text;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

function createInput() {
  const inputWrapper = document.createElement("div");
  inputWrapper.classList.add("input-line");

  const prompt = document.createElement("span");
  prompt.classList.add("prompt");
  prompt.textContent = "> ";

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("console-input");

  inputWrapper.appendChild(prompt);
  inputWrapper.appendChild(input);
  terminal.appendChild(inputWrapper);
  input.focus();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = input.value.trim();
      if (value !== "") {
        const question = flows[currentFlow][step];
        answers[question.key] = value;

        // reflejo especial para "razon" en emocional
        if (question.key === "razon") {
          printLine(`> ${value}`, "#fff");
          printLine(`🤝 Un amigo dice: "Me siento ${value}"`, "#0ff");
        } else {
          printLine("> " + value, "#fff");
        }

        inputWrapper.remove();

        step++;
        if (step < flows[currentFlow].length) {
          askQuestion();
        } else {
          finishFlow();
        }
      }
    }
  });
}

function askQuestion() {
  printLine(flows[currentFlow][step].text, "#0ff");
  createInput();
}

function finishFlow() {
  if (currentFlow === "inicial") {
    const phrase = random(dailyPhrases);
    printLine("✅ ¡Check-in inicial completado!", "#0f0");
    printLine("✨ Mensaje del día: " + phrase, "#ff0");
  } else if (currentFlow === "emocional") {
    const phrase = random(emotionalPhrases);
    printLine("✅ ¡Check-in emocional completado!", "#0f0");
    printLine("🎲 Frase motivacional: " + phrase, "#ff0");
  }
  printLine("💪 Bueno, pues hazlo tú!", "#0ff");

  // Lanzar countdown
  setTimeout(() => startCountdown(), 1500);

  // Guardar log
  const log = {
    ...answers,
    flow: currentFlow,
    date: new Date().toDateString()
  };
  localStorage.setItem("lastCheckin", JSON.stringify(log));
}

function startCountdown() {
  terminal.innerHTML = "";
  let count = 5;
  const interval = setInterval(() => {
    if (count > 0) {
      terminal.innerHTML = `<div class="countdown-big">${count}</div>`;
    } else if (count === 0) {
      terminal.innerHTML = `<div class="countdown-big">🚀 ¡Vamos!</div>`;
    } else {
      clearInterval(interval);
    }
    count--;
  }, 1000);
}

// Eventos
btnInicial.addEventListener("click", () => {
  resetFlow("inicial");
  askQuestion();
});

btnEmocional.addEventListener("click", () => {
  resetFlow("emocional");
  askQuestion();
});

function resetFlow(flow) {
  terminal.innerHTML = "";
  terminal.classList.remove("hidden");
  step = 0;
  answers = {};
  currentFlow = flow;
}
