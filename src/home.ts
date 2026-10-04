export function home(content: Element) {
  content.innerHTML = `
    <div class="home-container">
      <div class="home-icon-container">
        <i class="bi bi-link-45deg"></i>
        <i class="bi bi-play-btn-fill"></i>
        <i class="bi bi-music-note-beamed"></i>
        <i class="bi bi-book-fill"></i>
      </div>
      <h1>Make a Playlist of Anything. Then Share it.</h1>
      <a href="./create" class="home-create hover-effect">Create Playlist</a>
      <p>No Account Required</p>
      <i class="bi bi-caret-down-fill home-down"></i>
      <div style="height: 500px;"></div>
      <div class="cards">
        <img class="card-image"></img>
        <p class="card-text"></p>
      </div>
    </div>
  `;
  const arrow = document.querySelector<HTMLElement>(".home-down")!;
  window.addEventListener("scroll", () => {
    if (window.scrollY >> 0) {
      arrow.style.color = "transparent";
    }
    else {
      arrow.style.color = "white";
    }
  })
}
