export default function Skills({ items }) {
  return (
    <section className="block">
      <h2>What I am learning</h2>
      <ul className="chips">
        {items.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
