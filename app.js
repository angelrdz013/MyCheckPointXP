const terminal = document.getElementById("terminal");
const startBtn = document.getElementById("startCheckin");

let step = 0;
let answers = {};

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

const questions = [
  { key: "intencion", text: "📌 ¿Cuál es tu intención para hoy?" },
  { key: "reto", text: "🎯 ¿Cuál será tu reto personal/profesional?" },
  { key: "emocion", text: "🧠 ¿Cómo te sientes ahora?" },
  { key: "razon", text: "🤔 ¿Por qué te sientes así?" },
  { key: "consejo", text: "🤝 Un amigo dice eso... ¿Qué consejo le das?" }
];

// --- Utilidades ---
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
        answers[questions[step].key] = value;

        // Imprimir como output
        printLine("> " + value, "#fff");
        inputWrapper.remove();

        step++;
        if (step < questions.length) {
          askQuestion();
        } else {
          finishCheckin();
        }
      }
    }
  });
}

function askQuestion() {
  printLine(questions[step].text, "#0ff");
  createInput();
}

function finishCheckin() {
  const phraseDaily = random(dailyPhrases);
  const phraseEmo = random(emotionalPhrases);

  printLine("✅ ¡Check-in completado!", "#0f0");
  printLine("✨ Mensaje del día: " + phraseDaily, "#ff0");
  printLine("🎲 Frase motivacional: " + phraseEmo, "#ff0");
  printLine("💪 Bueno, pues hazlo tú!", "#0ff");

  // Countdown aparte
  let count = 5;
  const interval = setInterval(() => {
    printLine(count > 0 ? count : "🚀 ¡Vamos!", "#ff0");
    count--;
    if (count < 0) clearInterval(interval);
  }, 1000);

  // Guardar en localStorage
  const log = {
    ...answers,
    phraseDaily,
    phraseEmo,
    date: new Date().toDateString()
  };
  localStorage.setItem("lastCheckin", JSON.stringify(log));
}

startBtn.addEventListener("click", () => {
  terminal.innerHTML = "";
  terminal.classList.remove("hidden");
  step = 0;
  answers = {};
  askQuestion();
});
