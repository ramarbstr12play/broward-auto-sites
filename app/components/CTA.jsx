export default function CTA({ data }) {
  return (
    <section className="bg-primary-dark text-white py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{data.headline}</h2>
        <p className="text-lg text-blue-100 mb-8">{data.text}</p>
        <a
          href={data.buttonLink}
          className="inline-block bg-accent text-black font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          {data.buttonText}
        </a>
      </div>
    </section>
  );
}
