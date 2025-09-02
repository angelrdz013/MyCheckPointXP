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

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Preguntas para cada flujo ---
const flows = {
  inicial: [
    { key: "intencion", text: "📌 ¿Cuál es tu intención para hoy?" },
    { key: "reto", text: "🎯 ¿Cuál será tu reto personal/profesional?" }
  ],
  emocional: [
    { key: "emocion", text: "🧠 ¿Cómo te sientes ahora? (Elige un número)\n1. 😌 Bien, con energía\n2. 😐 Cansado\n3. 😫 Estresado\n4. 😔 Falta de motivación\n5. 😢 Triste\n6. 😵 Ansiedad / Tensión física" },
    { key: "razon", text: "🤔 ¿Por qué te sientes así?" },
    { key: "consejo", text: "🤝 Un amigo dice eso... ¿Qué consejo le das?" }
  ]
};

// --- Recomendaciones por emoción ---
const emocionesMap = {
  "1": { texto: "😌 Bien, con energía", actividad: "💪 Aprovecha tu energía para cumplir una meta importante en los próximos 30 minutos." },
  "2": { texto: "😐 Cansado", actividad: "🌿 Da una caminata o estírate 3-5 min. Tu cuerpo lo agradecerá." },
  "3": { texto: "😫 Estresado", actividad: "🧘 Respira profundo 3 veces y relaja tus hombros. Prioriza solo lo esencial." },
  "4": { texto: "😔 Falta de motivación", actividad: "📝 Anota 3 tareas pequeñas que puedas lograr hoy. Elige 1 y empieza." },
  "5": { texto: "😢 Triste", actividad: "🎵 Pon tu canción favorita y recuerda algo que te haga sonreír." },
  "6": { texto: "😵 Ansiedad / Tensión física", actividad: "😌 Haz 1 minuto de respiración consciente. Toma un descanso sensorial." }
};

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
        const question = flows[currentFlow][step];

        // --- Caso especial: emoción con opciones ---
        if (currentFlow === "emocional" && question.key === "emocion") {
          if (!emocionesMap[value]) {
            printLine("> Opción inválida. Escribe 1-6", "#f00");
            return;
          }
          answers[question.key] = emocionesMap[value].texto;
          answers["actividad"] = emocionesMap[value].actividad;
          printLine("> " + emocionesMap[value].texto, "#fff");
          printLine("💡 Actividad sugerida: " + emocionesMap[value].actividad, "#ff0");
        }
        // --- Caso especial: razón reflejada como amigo ---
        else if (currentFlow === "emocional" && question.key === "razon") {
          answers[question.key] = value;
          printLine("> " + value, "#fff");
          printLine(`🤝 Un amigo dice: "Me siento ${value}"`, "#0ff");
        }
        // --- Normal ---
        else {
          answers[question.key] = value;
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
    printLine("✅ ¡Check-in emocional completado!", "#0f0");
  }

  printLine("💪 Bueno, pues hazlo tú!", "#0ff");
  printLine("Presiona ENTER para continuar...", "#ff0");

  // Esperar Enter para lanzar countdown
  waitForEnter(() => startCountdown());

  // Guardar log
  const log = {
    ...answers,
    flow: currentFlow,
    date: new Date().toDateString()
  };
  localStorage.setItem("lastCheckin", JSON.stringify(log));
}

function waitForEnter(callback) {
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
      inputWrapper.remove();
      callback();
    }
  });
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

// --- Eventos ---
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
