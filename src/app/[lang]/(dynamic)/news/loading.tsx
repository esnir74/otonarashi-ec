export default function Loading() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="mx-auto skeleton-block"
            style={{
              height: "clamp(2.5rem, 3vw + 1.5rem, 3rem)",
              width: "clamp(10rem, 16vw + 6rem, 18rem)",
            }}
          />
        </div>

        <div className="border-t border-gray-300">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="border-b border-gray-300">
              <div className="py-8 px-4 sm:px-6">
                <div className="flex items-center gap-4 mb-4">
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
                      height: "clamp(1.6rem, 2vw + 1rem, 2.1rem)",
                      width: "5.5rem",
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <div
                    className="skeleton-block"
                    style={{
                      height: "clamp(0.95rem, 1vw + 0.65rem, 1.2rem)",
                      width: "82%",
                    }}
                  />
                  <div
                    className="skeleton-block"
                    style={{
                      height: "clamp(0.95rem, 1vw + 0.65rem, 1.2rem)",
                      width: "68%",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
