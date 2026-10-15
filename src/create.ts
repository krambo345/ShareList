import IconPicker from "vanilla-icon-picker";
import 'vanilla-icon-picker/dist/themes/bootstrap-5.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getSHA256Hash } from "boring-webcrypto-sha256";
import { createPlaylist } from "./firebase";

export async function create(content: Element) {
  content.innerHTML = `
    <div class="create-container">
    <h1>Create a New Playlist</h1>
    <form autocomplete="off">
      <label>Name</label>
      <input type="text" class="create-name hover-effect" autocomplete="off" />
      <label>Description</label>
      <input type="text" class="create-description hover-effect" autocomplete="off" />
      <label>Icon</label>
      <div class="icon-picker-input hover-effect"><i class="icon-preview"></i></div>
      <label>Expiration Date</label>
      <input type="date" class="create-expiration hover-effect" autocomplete="off" />
      <label>Password</label>
      <input type="password" class="create-password hover-effect" autocomplete="off" />
      <button type="button" class="create-submit hover-effect">Submit</button>
    </form>
    <p class="create-error"></p>
    </div>
    `;
  const iconPreview = document.querySelector(".icon-preview")!
  let selectedIcon = "fa-share-alt";
  const iconPicker = new IconPicker(".icon-picker-input", {
    theme: "bootstrap-5",
    iconSource: [
      "FontAwesome Solid 7",
      "FontAwesome Brands 7",
      "FontAwesome Regular 7"
    ],
    closeOnSelect: true
  });
  iconPreview.className = `icon-preview fa fa-share-alt`;
  selectedIcon = 'fa fa-share-alt';
  iconPicker.on('select', (instance: any) => {
    console.log('Select:', instance);
    iconPreview.className = `icon-preview ${instance.value}`;
    selectedIcon = instance.value;

  });

  document.querySelector(".create-submit")!.addEventListener("click", async () => {
    const name = document.querySelector<HTMLInputElement>(".create-name")!;
    const description = document.querySelector<HTMLInputElement>(".create-description")!;
    const expiration = document.querySelector<HTMLInputElement>(".create-expiration")!;
    const password = document.querySelector<HTMLInputElement>(".create-password")!;
    const currentDate = new Date();
    const maxExpirationDate = new Date(currentDate);
    maxExpirationDate.setDate(maxExpirationDate.getDate() + 90);
    const error = document.querySelector<HTMLParagraphElement>(".create-error")!;
    error.textContent = null;
    if (!name.value) {
      error.textContent = "Name Must be Set";
      wiggle();
    }
    else {
      if (!expiration.value) {
        error.textContent = "Expiration Date Must be Set";
        wiggle();
      }
      else {
        if (expiration.valueAsDate! <= currentDate) {
          error.textContent = "Expiration Date Can Not be Set to Before Today or to Today";
          wiggle();
        }
        else {
          if (expiration.valueAsDate! > maxExpirationDate) {
            error.textContent = "Expiration Date Can Not be Set to Longer Than 90 Days From Now";
            wiggle();
          }
          else {
            if (!password.value) {
              error.textContent = "Password Must be Set";
              wiggle();
            }
            else {
              if (password.value.length < 4) {
                error.textContent = "Password Must be four characters or longer";
                wiggle();
              }
              else {
                const hashedPassword = await getSHA256Hash(password.value);
                const id = await createPlaylist(name.value, description.value, selectedIcon, expiration.valueAsDate!, hashedPassword);
                window.location.href = `/p/${id}`;
              }
            }
          }
        }
      }
    }
  })
}

async function wiggle() {
  const button = document.querySelector<HTMLElement>(".create-submit")!;
  button.style.backgroundColor = "#EF6351";
  button.classList.add("wiggle");
  button.addEventListener("animationend", () => {
    button.classList.remove("wiggle");
    button.style.backgroundColor = "var(--colorDarkMinus)";
  });
}
