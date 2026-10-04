import { fetchPlaylist } from "./firebase";

export async function playlist(content: Element, id: string) {
  const data = await fetchPlaylist(id);
  if (!data) {
    content.innerHTML = `
    <div class="not-found-container">
      <i class="bi bi-search" style="font-size: 120px;"></i>
      <h1>Hmm... I can not find this!</h1>
      <h4>This playlist either does not exist or it has expired. (404)</h4>
    </div>
  `

  } else {
    content.innerHTML = data
    console.log(data);
  }
}
