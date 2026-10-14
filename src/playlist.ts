import { fetchPlaylist, editPlaylist } from "./firebase";
import IconPicker from "vanilla-icon-picker";
import 'vanilla-icon-picker/dist/themes/bootstrap-5.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export async function playlist(content: Element, id: string) {
  const data = await fetchPlaylist(id);
  let editing = false;
  if (!data) {
    content.innerHTML = `
    <div class="not-found-container">
      <i class="bi bi-search" style="font-size: 120px;"></i>
      <h1>Hmm... I can not find this!</h1>
      <h4>This playlist either does not exist or it has expired. (404)</h4>
    </div>
  `;

  } else {
    content.innerHTML = `
      <div class="playlist-container">
        <div class="playlist-header">
          <div class="playlist-icon">
            <i class="playlist-icon-actual"></i>
          </div>
          <div class="playlist-info-container">
            <h1 class="playlist-title"></h1>
            <input type="text" class="playlist-title-edit hover-effect">
            <h2 class="playlist-description"></h2>
            <input type="text" class="playlist-description-edit hover-effect">
          </div>
          <div class="playlist-extra">
          <div class="playlist-edit-button hover-effect">Edit</div>
          <div class="playlist-expiration">Expires:<p class="playlist-expiration-date"></p></div>
          </div>
          </div>
      </div>
      <div class="playlist-content">
        <button class="playlist-content-add hover-effect">Add</button> </div>


    `;
    const iconActual = document.querySelector<HTMLLIElement>(".playlist-icon-actual")!;
    const title = document.querySelector<HTMLHeadingElement>(".playlist-title")!;
    const description = document.querySelector<HTMLHeadingElement>(".playlist-description")!;
    const editButton = document.querySelector<HTMLDivElement>(".playlist-edit-button")!;
    const expiration = document.querySelector<HTMLDivElement>(".playlist-expiration-date")!;
    const titleEdit = document.querySelector<HTMLInputElement>(".playlist-title-edit")!;
    const descriptionEdit = document.querySelector<HTMLInputElement>(".playlist-description-edit")!;
    const contentAdd = document.querySelector<HTMLButtonElement>(".playlist-content-add")!;

    titleEdit.style.display = "none";
    descriptionEdit.style.display = "none";
    contentAdd.style.display = "none";
    contentAdd.addEventListener("click", () => {
      makeEntry("about:blank", true);
    })
    iconActual.className = `playlist-icon-actual ${data.icon}`;
    title.textContent = data.name;
    title.style.fontSize = `${Math.min(300 / Math.max(data.name.toString().length, 5), 60)}px`;
    description.textContent = data.description;
    expiration.textContent = new Date(data.expiration.seconds * 1000).toLocaleDateString();
    console.log(JSON.stringify(data))

    if (data.content) {
      data.content.forEach((link: string) => {
        makeEntry(link, false);
      });
    }
    editButton.addEventListener("click", async () => {
      if (editing == false) {
        editing = true;
        toggleEditing(editing);
      } else {
        if (editing == true) {
          const response = await applyDataWithPassword(id, content);
          if (response) {
            editing = false;
            await toggleEditing(editing);
            window.location.reload();
          }
        }
      }
    })
  }
}


async function makeEntry(url: string, editing: boolean) {
  let editingEntry = false;

  const entryHead = document.createElement("div");
  const entry = document.createElement("a");
  const linkContainer = document.createElement("div");
  const linkEdit = document.createElement("input");
  const nameContainer = document.createElement("div");
  const icon = document.createElement("img");
  const link = document.createElement("a");
  const titlePlace = document.createElement("span");
  const linkIcon = document.createElement("i");
  const contentContainer = document.querySelector(".playlist-content")!;
  const editButton = document.createElement("i");
  const removeButton = document.createElement("i");

  editButton.className = "bi bi-pencil-fill hover-effect playlist-entry-edit";
  removeButton.className = "bi bi-trash-fill hover-effect playlist-entry-remove";

  if (editing == true) {
    editButton.style.display = "block";
    removeButton.style.display = "block";
  }
  else {
    editButton.style.display = "none";
    removeButton.style.display = "none";
  }
  linkEdit.style.display = "none";
  nameContainer.appendChild(icon);
  linkContainer.appendChild(link);
  nameContainer.appendChild(titlePlace);
  linkContainer.appendChild(linkIcon);
  linkContainer.appendChild(linkEdit);

  entry.appendChild(nameContainer);
  entry.appendChild(linkContainer);

  entryHead.appendChild(entry);
  entryHead.appendChild(editButton);
  entryHead.appendChild(removeButton);

  entryHead.className = "playlist-entry-head";

  const trimmedUrl = url.trim();
  const normalizedUrl = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  let domain: URL;

  try {
    domain = new URL(normalizedUrl);

    const res = await fetch(domain.href);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    titlePlace.textContent = doc.title.trim() || domain.hostname;
  } catch (error) {
    console.log(`failed to get title of domain: ${error}`);

    const prettyTitle = trimmedUrl
      .replace(/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//, "")
      .split(/[/?#:]/)[0]
      .replace(/^www\./i, "")
      .split(".")[0];

    titlePlace.textContent = prettyTitle || trimmedUrl || "Untitled";

    domain = new URL(normalizedUrl);
  }
  link.className = "playlist-entry-link";
  nameContainer.className = "playlist-name-container";
  linkContainer.className = "playlist-link-container";
  icon.src = `https://www.google.com/s2/favicons?domain=${domain.hostname}`;
  entry.className = "playlist-entry hover-effect";
  linkIcon.className = "bi bi-box-arrow-up-right hover-effect";
  titlePlace.className = "playlist-title";
  entry.href = domain.href;
  entry.target = "_blank";
  link.textContent = url;
  contentContainer.appendChild(entryHead);

  editButton.addEventListener("click", () => {
    if (editingEntry == false) {
      editingEntry = true;
      linkEdit.style.display = "block";
      link.style.display = "none";
      linkEdit.value = link.textContent;
      editButton.className = "bi bi-floppy-fill hover-effect playlist-entry-edit";
      entry.removeAttribute("href");
    }
    else {
      if (editingEntry == true) {
        editingEntry = false;
        linkEdit.style.display = "none";
        link.style.display = "block";
        link.textContent = linkEdit.value;
        const editedUrl = linkEdit.value.trim();
        entry.href = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(editedUrl)
          ? editedUrl
          : `https://${editedUrl}`;
        editButton.className = "bi bi-pencil-fill hover-effect playlist-entry-edit";
      }
    }
  })
  removeButton.addEventListener("click", () => {
    entryHead.remove();
  })
}


async function toggleEditing(value: boolean) {
  const icon = document.querySelector<HTMLDivElement>(".playlist-icon")!;
  const iconActual = document.querySelector<HTMLLIElement>(".playlist-icon-actual")!;
  const title = document.querySelector<HTMLHeadingElement>(".playlist-title")!;
  const description = document.querySelector<HTMLHeadingElement>(".playlist-description")!;
  const editButton = document.querySelector<HTMLDivElement>(".playlist-edit-button")!;
  const titleEdit = document.querySelector<HTMLInputElement>(".playlist-title-edit")!;
  const descriptionEdit = document.querySelector<HTMLInputElement>(".playlist-description-edit")!;
  const contentAdd = document.querySelector<HTMLButtonElement>(".playlist-content-add")!;



  if (value == true) {
    title.style.display = "none";
    description.style.display = "none";
    editButton.textContent = "Save";
    titleEdit.style.display = "block";
    descriptionEdit.style.display = "block";
    contentAdd.style.display = "block";

    titleEdit.value = title.textContent;
    descriptionEdit.value = description.textContent;

    icon.classList.add("hover-effect");

    const iconPicker = new IconPicker(".playlist-icon", {
      theme: "bootstrap-5",
      iconSource: [
        "FontAwesome Solid 7",
        "FontAwesome Brands 7",
        "FontAwesome Regular 7"
      ],
      closeOnSelect: true
    });
    iconPicker.on('select', (instance: any) => {
      console.log('Select:', instance);
      iconActual.className = `playlist-icon-actual ${instance.value}`;
    });
    document.querySelectorAll<HTMLElement>(".playlist-entry-edit").forEach(edit => {
      edit.style.display = "block";
    });
    document.querySelectorAll<HTMLElement>(".playlist-entry-remove").forEach(remove => {
      remove.style.display = "block";
    });
  }
  else {
    if (value == false) {
      title.style.display = "block";
      description.style.display = "block";
      editButton.textContent = "Edit";
      titleEdit.style.display = "none";
      descriptionEdit.style.display = "none";
      contentAdd.style.display = "none";
      title.textContent = titleEdit.value;
      description.textContent = descriptionEdit.value;
      document.querySelectorAll<HTMLElement>(".playlist-entry-edit").forEach(edit => {
        edit.style.display = "none";
      });
      document.querySelectorAll<HTMLElement>(".playlist-entry-remove").forEach(remove => {
        remove.style.display = "none";
      });

    }
  }
}
async function applyDataWithPassword(id: string, container: Element): Promise<boolean> {
  let counter = 0;
  console.log(counter)
  const titleEdit = document.querySelector<HTMLInputElement>(".playlist-title-edit")!;
  const descriptionEdit = document.querySelector<HTMLInputElement>(".playlist-description-edit")!;
  const iconActual = document.querySelector<HTMLLIElement>(".playlist-icon-actual")!;

  const passwordContainer = document.createElement("div");
  const passwordHeader = document.createElement("h1");
  const passwordInput = document.createElement("input");
  const passwordSubmit = document.createElement("i");

  passwordContainer.className = "playlist-password-container";
  passwordHeader.className = "playlist-password-header";
  passwordInput.className = "playlist-password-input";
  passwordSubmit.className = "playlist-password-submit bi bi-arrow-right-circle-fill hover-effect";

  passwordHeader.textContent = "Password";
  passwordInput.type = "password";

  passwordContainer.appendChild(passwordHeader);
  passwordContainer.appendChild(passwordInput);
  passwordContainer.appendChild(passwordSubmit);
  container.appendChild(passwordContainer);

  return new Promise<boolean>((resolve) => {
    passwordSubmit.addEventListener("click", async () => {
      const userInput = passwordInput.value;
      if (counter < 3) {
        if (userInput.length < 4) {
          wiggle();
          counter++;
        }
        else {
          const content = document.querySelectorAll<HTMLDivElement>(".playlist-entry");
          let contentList = new Array;
          content.forEach(entry => {
            const url = entry.querySelector(".playlist-entry-link")!;
            contentList.push(url.textContent);
          });
          const newData = [
            titleEdit.value,
            descriptionEdit.value,
            iconActual.className.replace("playlist-icon-actual", ""),
            userInput
          ]

          if (await editPlaylist(id, newData[0], newData[1], newData[2], contentList, newData[3])) {
            passwordContainer.remove();
            passwordHeader.remove();
            passwordInput.remove();
            passwordSubmit.remove();
            resolve(true);
          }
          else {
            wiggle();
            counter++;
          }
        }
      }
      else {
        passwordContainer.remove();
        passwordHeader.remove();
        passwordInput.remove();
        passwordSubmit.remove();
        resolve(false);
      }
    })
  })
}
async function wiggle() {
  const button = document.querySelector<HTMLElement>(".playlist-password-submit")!;
  button.style.color = "#EF6351";
  button.classList.add("wiggle");
  button.addEventListener("animationend", () => {
    button.classList.remove("wiggle");
    button.style.color = "var(--text)";
  });
}
