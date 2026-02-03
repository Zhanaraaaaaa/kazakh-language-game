const form = document.querySelector("#generator-form");
const resultField = document.querySelector("#result");
const copyButton = document.querySelector("#copy");
const downloadButton = document.querySelector("#download");
const resetButton = document.querySelector("#reset");
const previewArea = document.querySelector("#preview");

const template = ({ title, description, question, answer, accent }) => `<!doctype html>
<html lang="kk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        font-family: "Inter", "Segoe UI", system-ui, sans-serif;
        background: #f8fafc;
        color: #0f172a;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(160deg, ${accent}33, #ffffff 60%);
      }

      .game {
        width: min(600px, 90vw);
        background: #ffffff;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 24px 50px rgba(15, 23, 42, 0.15);
      }

      h1 {
        margin-top: 0;
        color: ${accent};
      }

      button {
        border: none;
        background: ${accent};
        color: #ffffff;
        padding: 12px 18px;
        border-radius: 999px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      button:hover {
        transform: translateY(-1px);
      }

      input {
        width: 100%;
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        margin: 12px 0 18px;
        font-size: 1rem;
      }

      .result {
        margin-top: 16px;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="game">
      <h1>${title}</h1>
      <p>${description}</p>
      <h2>Сұрақ:</h2>
      <p>${question}</p>
      <label for="answer">Жауабыңызды жазыңыз:</label>
      <input id="answer" type="text" placeholder="Жауапты енгізіңіз" />
      <button id="check">Тексеру</button>
      <p id="feedback" class="result"></p>
    </div>

    <script>
      const correctAnswer = ${JSON.stringify(answer)}.trim().toLowerCase();
      const feedback = document.querySelector("#feedback");
      const answerInput = document.querySelector("#answer");

      document.querySelector("#check").addEventListener("click", () => {
        const userAnswer = answerInput.value.trim().toLowerCase();
        if (!userAnswer) {
          feedback.textContent = "Жауап енгізіңіз.";
          feedback.style.color = "#e11d48";
          return;
        }
        if (userAnswer === correctAnswer) {
          feedback.textContent = "Дұрыс! Керемет жұмыс.";
          feedback.style.color = "#16a34a";
        } else {
          feedback.textContent = "Қате. Тағы байқап көріңіз.";
          feedback.style.color = "#e11d48";
        }
      });
    <\/script>
  </body>
</html>`;

const previewTemplate = ({ title, description, question }) => `
  <div class="preview-game">
    <h3>${title || "Ойын атауы"}</h3>
    <p>${description || "Ойын сипаттамасы осында көрсетіледі."}</p>
    <h4>Сұрақ:</h4>
    <p>${question || "Сұрақ мәтінін енгізіңіз."}</p>
    <label for="preview-answer">Жауабыңызды жазыңыз:</label>
    <input id="preview-answer" type="text" placeholder="Жауапты енгізіңіз" />
    <button type="button">Тексеру</button>
    <p class="result">Жауабыңыз осында көрінеді.</p>
  </div>
`;

const updateOutput = (values) => {
  const html = template(values);
  resultField.value = html;
  previewArea.innerHTML = previewTemplate(values);
};

const getValues = () => {
  const formData = new FormData(form);
  return {
    title: (formData.get("gameTitle") || "").trim(),
    description: (formData.get("gameDescription") || "").trim(),
    question: (formData.get("gameQuestion") || "").trim(),
    answer: (formData.get("gameAnswer") || "").trim(),
    accent: formData.get("accentColor") || "#4f46e5",
  };
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateOutput(getValues());
});

const copyToClipboard = async () => {
  if (!navigator.clipboard || !window.isSecureContext) {
    resultField.removeAttribute("readonly");
    resultField.select();
    const copied = document.execCommand("copy");
    resultField.setAttribute("readonly", "readonly");
    if (!copied) {
      alert("Көшіріп алу мүмкін болмады. Мәтінді қолмен таңдаңыз.");
    }
    return;
  }
  await navigator.clipboard.writeText(resultField.value);
};

copyButton.addEventListener("click", async () => {
  if (!resultField.value) {
    alert("Алдымен кодты жасаңыз.");
    return;
  }
  await copyToClipboard();
  copyButton.textContent = "Көшірілді";
  setTimeout(() => {
    copyButton.textContent = "Көшіріп алу";
  }, 1800);
});

downloadButton.addEventListener("click", () => {
  if (!resultField.value) {
    alert("Алдымен кодты жасаңыз.");
    return;
  }
  const blob = new Blob([resultField.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kazakh-game.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

resetButton.addEventListener("click", () => {
  form.reset();
  resultField.value = "";
  previewArea.innerHTML = "";
});

updateOutput(getValues());
