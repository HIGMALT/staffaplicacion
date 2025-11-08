// pegar CSRF
async function getCsrf() {
  const res = await fetch('/api/get_csrf.php');
  const j = await res.json();
  return j.csrf;
}

document.getElementById("staffForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status");
  status.textContent = "Enviando...";
  const csrf = await getCsrf();
  
  const data = {
    serverName: document.getElementById("serverName").value,
    serverLink: document.getElementById("serverLink").value,
    applicantName: document.getElementById("applicantName").value,
    age: document.getElementById("age").value,
    role: document.getElementById("role").value,
    experience: document.getElementById("experience").value,
    reason: document.getElementById("reason").value,
    discord: document.getElementById("discord").value,
    csrf: csrf
  };
  
  try {
    const res = await fetch('/api/send_webhook.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const j = await res.json();
    if (res.ok && j.ok) {
      status.textContent = "✅ Aplicação enviada com sucesso!";
      status.style.color = "#8cff8c";
      document.getElementById("staffForm").reset();
    } else {
      status.textContent = "❌ " + (j.error || 'Erro desconhecido');
      status.style.color = "#ff7b7b";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "⚠️ Erro de conexão com o servidor.";
    status.style.color = "#ff7b7b";
  }
});