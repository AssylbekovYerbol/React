// >>> EDIT THIS FILE: put your own information here. <<<
// To use your own photo: put it in src/assets (for example photo.jpg)
// and change the import below to: import avatar from "./assets/photo.jpg";
import avatar from "./assets/photo.png";

export const profile = {
  name: "Assylbekov Yerbol",
  role: "Junior Frontend Developer",
  tagline: "Learning React and building small things that work.",
  photo: avatar,
};

export const about = {
  text: [
    "Hi! I am a student who is learning web development. I like turning ideas into small interactive pages and I enjoy learning how things work under the hood.",
    "Right now I study HTML, CSS, JavaScript and React.",
  ],
  funFacts: [
    "I wrote my first line of JavaScript in 2026.",
    "I believe every bug has a logical reason.",
    "I prefer dark mode, but I built this page in light mode.",
  ],
};

export const skills = ["HTML", "CSS", "JavaScript", "React", "Git", "GitHub"];

export const contacts = [
  { label: "GitHub", value: "github.com/AssylbekovYerbol", href: "https://github.com/AssylbekovYerbol" },
  { label: "Instagram", value: "@just_yerb01", href: "https://instagram.com/@just_yerb01" },
  { label: "Location", value: "Planet Earth" },
];
