// SOLO PC
if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.getElementById("app").style.display = "none";
    document.getElementById("no-pc").style.display = "block";
  }
  
  // Tema
  const toggleTheme = document.getElementById("toggleTheme");
  toggleTheme.onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  };
  
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
  
  // Suscripciones
  let subs = JSON.parse(localStorage.getItem("subs")) || [];
  
  function renderSubs() {
    const container = document.getElementById("subs");
    container.innerHTML = "";
    subs.forEach((s, i) => {
      container.innerHTML += `
        <input type="number" value="${s}" onchange="updateSub(${i}, this.value)">
      `;
    });
  }
  
  function updateSub(index, value) {
    subs[index] = Number(value);
    save();
  }
  
  document.getElementById("addSub").onclick = () => {
    subs.push(0);
    save();
  };
  
  function save() {
    localStorage.setItem("subs", JSON.stringify(subs));
    calculate();
    renderSubs();
  }
  
  // Tipo de cambio automático (ejemplo API pública simple)
  let tipoCambio = 520;
  
  async function fetchCambio() {
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await res.json();
      tipoCambio = data.rates.CRC;
      calculate();
    } catch {
      console.log("No se pudo obtener tipo de cambio");
    }
  }
  
  fetchCambio();
  
  // Cálculos
  function calculate() {
    let totalUSD = subs.reduce((a,b)=>a+b,0);
    let totalCRC = totalUSD * tipoCambio;
  
    document.getElementById("totalUSD").textContent = totalUSD.toFixed(2);
    document.getElementById("totalCRC").textContent = totalCRC.toFixed(2);
  
    let ahorro = Number(document.getElementById("ahorro").value) || 0;
  
    if (ahorro >= totalCRC) {
      document.getElementById("estado1").textContent = "🟢 Cubierto";
    } else {
      document.getElementById("estado1").textContent = "🔴 Falta " + (totalCRC - ahorro).toFixed(2);
    }
  
    let pagoDia = Number(document.getElementById("pagoDia").value) || 0;
    let hoy = new Date();
    let diasRest = 0;
  
    for (let d = hoy.getDate(); d <= 31; d++) {
      let fecha = new Date(hoy.getFullYear(), hoy.getMonth(), d);
      if (fecha.getDay() !== 0 && fecha.getDay() !== 6) diasRest++;
    }
  
    let proyectado = diasRest * pagoDia;
    let fondo = proyectado * 0.05;
    let disponible = proyectado - totalCRC - fondo;
  
    document.getElementById("diasRestantes").textContent = diasRest;
    document.getElementById("proyectado").textContent = proyectado.toFixed(2);
    document.getElementById("fondo").textContent = fondo.toFixed(2);
    document.getElementById("disponible").textContent = disponible.toFixed(2);
  }
  
  document.querySelectorAll("input").forEach(i=>{
    i.addEventListener("input", calculate);
  });
  
  renderSubs();
  calculate();