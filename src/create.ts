import IconPicker from "vanilla-icon-picker";
import 'vanilla-icon-picker/dist/themes/bootstrap-5.min.css';

export function create(content: Element) {
  content.innerHTML = `
    <h1>Create a New Playlist</h1>
    <form>
      <label>Name *</label>
      <inp type="text" required></inp>
      <label>Description</label>
      <inp type="text"></inp>
      <label>Icon</label>
      <inp class="icon-picker-spot"></inp>
    </form>
`;
  const iconPicker = new IconPicker(".icon-picker-input", {
    theme: "bootstrap-5",
    iconSource: [
      "FontAwesome Solid 6",
      "FontAwesome Brands 6",
      "FontAwesome Regular 6",
      "Material Design Icons",
      "Iconoir"
    ],
    closeOnSelect: true
  });
}
