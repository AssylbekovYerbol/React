import Profile from "./components/Profile.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Contacts from "./components/Contacts.jsx";
import { profile, about, skills, contacts } from "./data.js";

export default function App() {
  return (
    <div className="page">
      <aside className="side">
        <Profile {...profile} />
        <Contacts items={contacts} />
      </aside>
      <main className="main">
        <About text={about.text} funFacts={about.funFacts} />
        <Skills items={skills} />
      </main>
    </div>
  );
}
