export function page404(content: Element) {
  content.innerHTML = `
    <div class="not-found-container">
      <i class="bi bi-search" style="font-size: 120px;"></i>
      <h1>Hmm... I can not find this!</h1>
      <h4>This page does not exist or can not be found. (404)</h4>
    </div>
  `

}
