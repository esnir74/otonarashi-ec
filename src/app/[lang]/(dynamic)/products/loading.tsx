export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height,64px))] bg-white flex items-center justify-center px-4 overflow-hidden">
      <div className="text-center space-y-8 max-w-lg w-full">
        <div
          className="mx-auto skeleton-block"
          style={{
            height: "clamp(2.5rem, 3vw + 1.5rem, 3.5rem)",
            width: "clamp(10rem, 20vw + 8rem, 18rem)",
          }}
        />
        <div
          className="mx-auto skeleton-block"
          style={{
            height: "2px",
            width: "6rem",
          }}
        />
        <div className="space-y-3">
          <div
            className="mx-auto skeleton-block"
            style={{
              height: "clamp(1rem, 1vw + 0.7rem, 1.3rem)",
              width: "clamp(8rem, 16vw + 6rem, 14rem)",
            }}
          />
          <div
            className="mx-auto skeleton-block"
            style={{
              height: "clamp(0.85rem, 0.8vw + 0.6rem, 1.1rem)",
              width: "clamp(12rem, 22vw + 8rem, 20rem)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
