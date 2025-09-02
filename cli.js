const terminal = document.getElementById("terminal");
const startBtn = document.getElementById("startCheckin");

let step = 0;
let answers = {};
const questions = [
  { key: "intencion", text: "📌 ¿Cuál es tu intención para hoy?" },
  { key: "reto", text: "🎯 ¿Cuál será tu reto personal/profesional?" },
  { key: "emocion", text: "🧠 ¿Cómo te sientes ahora?" },
  { key: "razon", text: "🤔 ¿Por qué te sientes así?" },
  { key: "consejo", text: "🤝 Un amigo dice eso... ¿Qué consejo le das?" }
];

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
  input.style.background = "black";
  input.style.color = "#0f0";
  input.style.border = "none";
  input.style.outline = "none";
  input.style.flex = "1";
  input.autofocus = true;

  inputWrapper.appendChild(prompt);
  inputWrapper.appendChild(input);
  terminal.appendChild(inputWrapper);
  input.focus();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = input.value.trim();
      if (value !== "") {
        answers[questions[step].key] = value;

        // Print as output
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
  printLine("✅ ¡Check-in completado!", "#0f0");
  printLine("🚀 5...4...3...2...1... ¡Vamos!", "#ff0");
  console.log("Respuestas:", answers);
}

startBtn.addEventListener("click", () => {
  terminal.innerHTML = "";
  terminal.classList.remove("hidden");
  step = 0;
  answers = {};
  askQuestion();
});
