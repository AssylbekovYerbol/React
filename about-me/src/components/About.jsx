import { useState } from "react";

export default function About({ text, funFacts }) {
  const [index, setIndex] = useState(0);

  return (
    <section className="block">
      <h2>About me</h2>
      {text.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      <div className="fact">
        <p>{funFacts[index]}</p>
        <button onClick={() => setIndex((index + 1) % funFacts.length)}>
          Another fun fact
        </button>
      </div>
    </section>
  );
}
