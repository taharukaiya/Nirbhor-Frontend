import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="mx-auto flex w-11/12 min-h-[70vh] items-center justify-center py-12 lg:w-10/12">
      <section className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-slate-200 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0066FF]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-[#011F50]">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for does not exist.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#011F50]"
          to="/"
        >
          Return Home
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
