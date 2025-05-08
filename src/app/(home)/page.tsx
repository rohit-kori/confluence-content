import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Confluence Content</h1>
      <p className="text-fd-muted-foreground">
        You can open{" "}
        <Link
          href="/confluence"
          className="text-fd-foreground font-semibold underline"
        >
          /confluence
        </Link>{" "}
        and see the documentation.
      </p>
    </main>
  );
}
