import "./style.css";
import { structure } from "./structure";
import { home } from "./home"
import { page404 } from "./404";
import { create } from "./create";
import { about } from "./about"
import { playlist } from "./playlist"
const app = document.querySelector<HTMLDivElement>('#app')!;
const content = structure(app);
function router() {
  const path = window.location.pathname;
  if (path === "/" || path === "/home") {
    home(content);
  } else {
    if (path === "/create") {
      create(content);
    } else {
      if (path === "/about") {
        about(content);
      }
      else {
        const playlistMatch = path.match(/^\/p\/([^/]+)$/);
        if (playlistMatch) {
          const playlistID = playlistMatch[1];
          if (path === `/p/${playlistID}`) {
            playlist(content, playlistID);
          }
        }
        else {
          page404(content);
        }
      }
    }
  }
}
router()
