const terminal = document.getElementById("terminal");
const btnInicial = document.getElementById("startInicial");
const btnEmocional = document.getElementById("startEmocional");

let step = 0;
let answers = {};
let currentFlow = "";

const dailyPhrases = [
  "🎯 Hoy es el día donde harás grandes cosas.",
  "💪 Todo empieza por tu y lo que te propones a hacer.",
  "🧘‍♀️ Tu mente es tu casa. Límpiala todos los días.",
  "🕹️ Cada día es un nuevo nivel. ¡Desbloquealo!",
  "🚀 No tienes que hacerlo perfecto. Solo avanzar un paso más.",
];

// --- Preguntas ---
const flows = {
  inicial: [
    { key: "intencion", text: "📌 ¿Cuál es tu intención para hoy?" },
    { key: "reto", text: "🎯 ¿Cuál será tu reto personal/profesional?" }
  ],
  emocional: [
    { 
      key: "emocion", 
      text: `🧠 ¿Cómo te sientes ahora? (Escribe un número)

1. 😌 Bien, con energía
2. 😐 Cansado
3. 😫 Estresado
4. 😔 Falta de motivación
5. 😢 Triste
6. 😵 Ansiedad / Tensión física`
    },
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
  // Reemplazar saltos de línea por <br> para mantener formato
  line.innerHTML = text.replace(/\n/g, "<br>");
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
          const elegido = emocionesMap[value];
          answers[question.key] = elegido.texto;
          answers["actividad"] = elegido.actividad;

          // Reimprimir confirmación
          printLine("> " + elegido.texto, "#fff");
          printLine("💡 Actividad sugerida: " + elegido.actividad, "#ff0");
        }
        // --- Caso especial: razón reflejada como amigo ---
        else if (currentFlow === "emocional" && question.key === "razon") {
          answers[question.key] = value;
          printLine("> " + value, "#fff");
          printLine(`🤝 Un amigo dice: "${value}"`, "#0ff");
        }
        // --- Normal ---
        else {
          answers[question.key] = value;
          printLine("> " + value, "#fff");
          printLine("💪 Bueno, pues hazlo tú!", "#0ff");
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
    answers["frase"] = phrase; // guardar también
    printLine("✅ ¡Check-in inicial completado!", "#0f0");
    printLine("✨ Mensaje del día: " + phrase, "#ff0");
  } else if (currentFlow === "emocional") {
    printLine("✅ ¡Check-in emocional completado!", "#0f0");
    // si hay emoción, mostrarla en el resumen
    if (answers["emocion"] && answers["actividad"]) {
      printLine("😌 Estado elegido: " + answers["emocion"], "#fff");
      printLine("💡 Actividad: " + answers["actividad"], "#ff0");
    }
  }
  printLine("Presiona ENTER para continuar...", "#ff0");

  // Esperar Enter para lanzar countdown
  waitForEnter(() => startCountdown());

  // Guardar log (acumular historial en localStorage)
  let logs = JSON.parse(localStorage.getItem("checkinLogs")) || [];
  const log = {
    ...answers,
    flow: currentFlow,
    date: new Date().toLocaleString()
  };
  logs.push(log);
  localStorage.setItem("checkinLogs", JSON.stringify(logs));
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

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
