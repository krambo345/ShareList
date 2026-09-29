export function structure(app: HTMLDivElement) {
  app.innerHTML = `
    <div class="cursor-glow" id="cursor-glow"></div>
    <div class="bar">
      <div class="barLeft">
        <a href="/home" class="hover-effect">ShareList</a>
        <a href="/create" class="hover-effect">Create</a>
        <a href="/about" class="hover-effect">About</a>
        <i class="bi theme-icon hover-effect" style="font-size: 24px;"></i>
      </div>
      <div class="barRight">loading...</div>
    </div>
    <div class="content"></div>
  `;
  cursorGlow();
  mode();
  clock();
  setInterval(clock, 1000);
  const content = document.querySelector(".content")!;
  return content;
}
function clock() {
  const element = document.querySelector(".barRight")!;
  const date = new Date();
  const time = `${hour(date.getHours())}:${minute(date.getMinutes())}`;
  element.textContent = time;
}
function hour(h: number) {
  if (h.toString().length < 2) {
    return `0${h}`;
  }
  else {
    return h;
  }
}
function minute(m: number) {
  if (m.toString().length < 2) {
    return `0${m}`;
  }
  else {
    return m;
  }
}
function cursorGlow() {
  const glowElement = document.getElementById("cursor-glow")!;
  var mouseX = 0;
  var mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glowElement.style.left = `${mouseX}px`;
    glowElement.style.top = `${mouseY}px`;
  })
}
function mode() {
  const toggle = document.querySelector(".theme-icon")!;
  let theme: string = "night";

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme == null || savedTheme == "night") {
    theme = "night";
    toggle.classList.add("bi-moon-fill");
  } else {
    theme = "light";
    toggle.classList.add("bi-brightness-high-fill");
    applyTheme(theme);
  }

  toggle.addEventListener("click", () => {
    if (theme == "night") {
      theme = "light";
      localStorage.setItem("theme", "light");
      applyTheme(theme);
    } else {
      theme = "night";
      localStorage.setItem("theme", "night");
      applyTheme(theme);
    }
  });
}

function applyTheme(t: string) {
  const body = document.documentElement.style;
  const toggle = document.querySelector(".theme-icon")!;
  if (t == "night") {
    toggle.classList.replace("bi-brightness-high-fill", "bi-moon-fill");
    body.setProperty("--colorDark", "#1d0e2c");
    body.setProperty("--colorDarkMinus", "#2d2c5e");
    body.setProperty("--colorMiddle", "#3d4b91");
    body.setProperty("--colorBrightMinus", "#4e69c3");
    body.setProperty("--colorBright", "#5e87f5");
    body.setProperty("--text", "#fff9e1");
  }
  else {
    if (t == "light") {
      toggle.classList.replace("bi-moon-fill", "bi-brightness-high-fill");
      body.setProperty("--colorDark", "#d66b4e");
      body.setProperty("--colorDarkMinus", "#e18b6d");
      body.setProperty("--colorMiddle", "#ebaa8c");
      body.setProperty("--colorBrightMinus", "#f5caaa");
      body.setProperty("--colorBright", "#ffe9c9");
      body.setProperty("--text", "#fff9e1")
    }
  }
}
