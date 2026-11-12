import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Biblioteca" },
  { to: "/entradas", label: "Minhas entradas" },
  { to: "/progresso", label: "Meu progresso" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b bg-background/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="font-display text-2xl italic">Language Journal</Link>
        <nav aria-label="Principal" className="flex gap-1 text-sm">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              activeProps={{ className: "bg-secondary text-foreground" }}>{n.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
