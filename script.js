const body = document.querySelector("body");
const text__div = document.createElement("div");
const text__h1 = document.createElement("h1");
const text__h2 = document.createElement("h2");
const actions = {};
let isPlay = false;
let isMusic = false;
let pressed;

text__h1.textContent = "Piano";
text__h2.textContent =
  "To play sound, you can use your touchpad or mouse, or press the corresponding keys on your keyboard.";

text__div.appendChild(text__h1);
text__div.appendChild(text__h2);
text__div.classList.add("text");

body.appendChild(text__div);

const field = document.createElement("div");
const keyboard = document.createElement("div");
const keys = [
  { name: "do", key: "a", sound: "do.mp3" },
  { name: "re", key: "s", sound: "re.mp3" },
  { name: "mi", key: "d", sound: "mi.mp3" },
  { name: "fa", key: "f", sound: "fa.mp3" },
  { name: "salt", key: "g", sound: "salt.mp3" },
  { name: "la", key: "h", sound: "la.mp3" },
  { name: "c", key: "j", sound: "c.mp3" },
];

keys.forEach((key, i) => {
  const keyDiv = document.createElement("div");
  const audio = new Audio("./assets/sounds/" + key.sound);

  const key__span = document.createElement("span");
  key__span.id = "ks-" + i;
  key__span.textContent = key.key.toUpperCase();

  const editSaveFn = () => {
    const saveElem = document.getElementById("eb-" + i);
    const spanElem = document.getElementById("ks-" + i);
    const editElem = document.getElementById("ei-" + i);

    const isEdit = saveElem.textContent === "Edit";
    const toShow = isEdit ? editElem : spanElem;
    const toHide = isEdit ? spanElem : editElem;

    if (!isEdit) {
      const value = editElem.value.toLowerCase();
      if (value.length !== 1 || (value !== key.key && actions[value])) {
        return;
      }

      if (value !== key.key) {
        spanElem.textContent = value.toUpperCase();
        actions[value] = actions[key.key];
        actions[key.key] = undefined;
        key.key = value;
      }

      saveElem.classList.remove("hiden");
    } else {
      saveElem.classList.add("hiden");
    }
    toShow.classList.remove("hiden");
    toHide.classList.add("hiden");

    saveElem.textContent = isEdit ? "Save" : "Edit";
  };

  const edit__button = document.createElement("button");
  edit__button.textContent = "Edit";
  edit__button.id = "eb-" + i;
  edit__button.addEventListener("click", (e) => {
    e.preventDefault();

    editSaveFn();
  });

  const edit__input = document.createElement("input");
  edit__input.classList.add("hiden");
  edit__input.classList.add("edit__inp");
  edit__input.id = "ei-" + i;
  edit__input.value = key.key.toUpperCase();
  keyDiv.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      editSaveFn();
    }
  });

  keyDiv.classList.add("key");
  keyDiv.appendChild(key__span);
  keyDiv.appendChild(edit__input);
  keyDiv.appendChild(edit__button);

  function toplay(isMusicForce = false) {
    if (!isMusicForce && isMusic) {
      return;
    }

    audio.currentTime = 0;
    if (!isPlay) {
      keyDiv.classList.add("active");
      isPlay = true;
      audio.play();
      setTimeout(() => (isPlay = false), 200);
      audio.addEventListener("ended", () => {
        isPlay = false;
        keyDiv.classList.remove("active");
      });
    }
  }
  function tostop() {
    keyDiv.classList.remove("active");
  }

  keyDiv.addEventListener("mousedown", () => toplay());
  keyDiv.addEventListener("mouseup", () => tostop());

  keyboard.appendChild(keyDiv);
  actions[key.key.toLowerCase()] = { play: toplay, stop: tostop };
});
keyboard.classList.add("keyboard");
body.appendChild(keyboard);

document.addEventListener("keypress", (e) => {
  const key = e.key.toLowerCase();
  if (actions[key] && !isPlay && pressed !== key) {
    pressed = key;
    actions[key].play();
  }
});
document.addEventListener("keyup", (e) => {
  pressed = undefined;

  const key = e.key.toLowerCase();
  if (actions[key]) {
    actions[key].stop();
  }
});

const music__input = document.createElement("input");
const play__button = document.createElement("button");
const author__field = document.createElement("div");
music__input.classList.add("musical");
music__input.maxLength = 14;
author__field.classList.add("author");
play__button.textContent = "Play";
author__field.appendChild(music__input);
author__field.appendChild(play__button);
body.appendChild(author__field);

play__button.addEventListener("click", async () => {
  isMusic = true;
  const value__input = document.querySelector(".musical")?.value || "";
  const notes = value__input.toLowerCase().split("");
  music__input.setAttribute('disabled', true);
  play__button.setAttribute('disabled', true);
  await notes.reduce(async (chain, note) => {
    await chain;

    if (actions[note]) {
      actions[note].play(true);
      return new Promise((res) => {
        setTimeout(() => res(true), 300);
      });
    }
    
    return;
  }, Promise.resolve());
  isMusic = false;
  music__input.removeAttribute('disabled');
  play__button.removeAttribute('disabled');
});
