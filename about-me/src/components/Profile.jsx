export default function Profile({ name, role, tagline, photo }) {
  return (
    <section className="profile">
      <img className="photo" src={photo} alt={"Portrait of " + name} />
      <h1>{name}</h1>
      <p className="role">{role}</p>
      <p className="tagline">{tagline}</p>
    </section>
  );
}
