export function StateScreen({ children, title }) {
  return (
    <main className="state-screen">
      <h1>{title}</h1>
      {children}
    </main>
  );
}
