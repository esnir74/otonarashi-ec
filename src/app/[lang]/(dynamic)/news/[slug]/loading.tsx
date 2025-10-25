export default function Loading() {
  return (
    <article className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="skeleton-block"
              style={{
                height: "clamp(0.75rem, 0.8vw + 0.5rem, 0.95rem)",
                width: "6rem",
              }}
            />
            <div
              className="skeleton-block"
              style={{
                height: "clamp(1.6rem, 2vw + 1rem, 2.2rem)",
                width: "7rem",
              }}
            />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="skeleton-block"
                style={{
                  height: "clamp(1.6rem, 2.4vw + 1.2rem, 2.6rem)",
                  width: idx === 2 ? "68%" : "100%",
                }}
              />
            ))}
          </div>
        </header>

        <div className="mb-12 relative w-full aspect-video overflow-hidden rounded-lg bg-white">
          <div className="skeleton-block w-full h-full" />
        </div>

        <section className="space-y-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="space-y-3">
              <div
                className="skeleton-block"
                style={{
                  height: "clamp(0.95rem, 1vw + 0.65rem, 1.2rem)",
                  width: "100%",
                }}
              />
              <div
                className="skeleton-block"
                style={{
                  height: "clamp(0.95rem, 1vw + 0.65rem, 1.2rem)",
                  width: "94%",
                }}
              />
              <div
                className="skeleton-block"
                style={{
                  height: "clamp(0.95rem, 1vw + 0.65rem, 1.2rem)",
                  width: idx % 2 === 0 ? "88%" : "72%",
                }}
              />
            </div>
          ))}
        </section>

        <footer className="mt-16 pt-8 border-t border-gray-300">
          <div
            className="skeleton-block"
            style={{
              height: "clamp(0.85rem, 1vw + 0.55rem, 1.05rem)",
              width: "9rem",
            }}
          />
        </footer>
      </div>
    </article>
  );
}
