// Pista:
// Intenta escribir en el teclado algo interesante...

let code = "";
window.addEventListener("keydown", (e)=>{
  code += e.key.toLowerCase();
  if (code.includes("admin")) {
    alert("Bienvenido al núcleo oculto.");
    document.body.style.background = "black";
    document.body.style.color = "lime";
  }
});