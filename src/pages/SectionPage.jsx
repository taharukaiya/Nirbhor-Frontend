function SectionPage({ title, description }) {
  return (
    <div className="mx-auto w-11/12 py-12 lg:w-10/12">
      <section className="rounded-3xl bg-white px-6 py-10 shadow-sm ring-1 ring-slate-200 lg:px-10 lg:py-14">
        <span className="inline-flex rounded-full bg-[#0066FF]/10 px-4 py-2 text-sm font-semibold text-[#0066FF]">
          Nirbhor
        </span>
        <h1 className="mt-4 text-3xl font-bold text-[#011F50] md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
          {description}
        </p>
      </section>
    </div>
  );
}

export default SectionPage;
