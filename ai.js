const API_KEY = "AIzaSyDa_Px9lsJI0nAbiPmBWNGIHvRaYsSj6z8";

const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatContainer = document.getElementById("chatContainer");

const promptDasar = {
  role: "system",
  content: "Kamu adalah pembina siswa ramah, sopan, dan selalu menjawab dalam bahasa Indonesia yang singkat dan jelas."
};

function tampilkanPesan(pesan, pengirim) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${pengirim}`;
  bubble.textContent = pesan;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function kirimKeGemini(pesan) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const body = {
      contents: [
        { parts: [{ text: promptDasar.content }] },
        { parts: [{ text: pesan }] }
      ],
      temperature: 0.7,
      candidateCount: 1,
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      const textResponse = data.candidates && data.candidates[0] && data.candidates[0].content;
      return textResponse || "Maaf, terjadi kesalahan saat memproses data.";
    } catch (err) {
      console.error(err);
      return "ERROR 404. cek kembali koneksi internet anda atau refresh.";
    }
  }
  

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  tampilkanPesan(userMessage, "user");
  input.value = "";

  const keyword = userMessage.toLowerCase();
  if (keyword.includes("tool sd") || keyword.includes("tools sd") || keyword.includes("tool")) {
    tampilkanPesan("Berikut link tool khusus: https://example.com/tools-sd", "ai");
    return;
  }

  const aiResponse = await kirimKeGemini(userMessage);
  tampilkanPesan(aiResponse, "ai");
});