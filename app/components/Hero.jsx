export default function Hero({ data, phone }) {
  return (
    <section className="bg-primary text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          {data.headline}
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {data.subheadline}
        </p>
        <a
          href={data.ctaLink}
          className="inline-block bg-accent text-black font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          {data.ctaText} — {phone}
        </a>
      </div>
    </section>
  );
}
