export default function Loading() {
  return (
    <section className="w-full bg-white">
      <div className="w-full">
        <div className="pt-24 pb-16 px-6 flex flex-col items-center gap-12">
          <div
            className="skeleton-block"
            style={{
              height: "clamp(2.5rem, 3vw + 1.5rem, 3rem)",
              width: "clamp(10rem, 18vw + 6rem, 15rem)",
            }}
          />
          <div
            className="relative w-full overflow-hidden rounded skeleton-block"
            style={{ aspectRatio: "16 / 9" }}
          />
          <div className="w-full max-w-3xl space-y-6 md:space-y-8">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="skeleton-block"
                style={{
                  height: "clamp(0.85rem, 1vw + 0.5rem, 1.1rem)",
                  width: idx % 2 === 0 ? "75%" : "60%",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-16">
          <div
            className="mx-auto skeleton-block"
            style={{
              height: "clamp(2.5rem, 3vw + 1.5rem, 3rem)",
              width: "clamp(9rem, 12vw + 6rem, 14rem)",
            }}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-20">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4">
                <div
                  className="relative overflow-hidden skeleton-circle"
                  style={{ aspectRatio: "1 / 1", width: "85%" }}
                />
                <div
                  className="skeleton-block"
                  style={{
                    height: "clamp(0.85rem, 1vw + 0.5rem, 1.1rem)",
                    width: "clamp(5rem, 4vw + 3rem, 6rem)",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
            <div
              className="skeleton-block mx-auto"
              style={{
                height: "clamp(0.85rem, 1vw + 0.5rem, 1.1rem)",
                width: "clamp(13rem, 16vw + 9rem, 16rem)",
              }}
            />
            <div
              className="skeleton-block mx-auto"
              style={{
                height: "clamp(0.7rem, 0.8vw + 0.45rem, 0.9rem)",
                width: "66%",
              }}
            />
          </div>

          <div className="w-full max-w-md mx-auto space-y-8">
            <div
              className="w-full rounded skeleton-block"
              style={{ aspectRatio: "1 / 1" }}
            />
            <div className="space-y-4">
              <div
                className="skeleton-block mx-auto"
                style={{
                  height: "clamp(0.85rem, 1vw + 0.5rem, 1.1rem)",
                  width: "clamp(11rem, 14vw + 8rem, 13rem)",
                }}
              />
              <div
                className="skeleton-block mx-auto"
                style={{
                  height: "clamp(0.7rem, 0.8vw + 0.45rem, 0.9rem)",
                  width: "66%",
                }}
              />
              <div
                className="skeleton-block mx-auto"
                style={{
                  height: "clamp(0.7rem, 0.8vw + 0.45rem, 0.9rem)",
                  width: "66%",
                }}
              />
            </div>
          </div>

          <div className="w-full max-w-md mx-auto space-y-8">
            <div
              className="w-full rounded skeleton-block"
              style={{ aspectRatio: "1 / 1" }}
            />
            <div className="space-y-4">
              <div
                className="skeleton-block mx-auto"
                style={{
                  height: "clamp(0.85rem, 1vw + 0.5rem, 1.1rem)",
                  width: "clamp(11rem, 14vw + 8rem, 13rem)",
                }}
              />
              <div
                className="skeleton-block mx-auto"
                style={{
                  height: "clamp(0.7rem, 0.8vw + 0.45rem, 0.9rem)",
                  width: "66%",
                }}
              />
              <div
                className="skeleton-block mx-auto"
                style={{
                  height: "clamp(0.7rem, 0.8vw + 0.45rem, 0.9rem)",
                  width: "66%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
