import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 text-5xl">🌴</span>
      <h1 className="font-display text-2xl font-bold text-brand-brown">
        Category Not Found
      </h1>
      <p className="mt-2 text-brand-brown/50">
        This category doesn&apos;t exist or has no items.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-orange px-6 py-2.5 font-semibold text-white hover:bg-brand-red"
      >
        Back to Menu
      </Link>
    </div>
  );
}
