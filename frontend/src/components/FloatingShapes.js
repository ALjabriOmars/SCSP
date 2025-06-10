// src/components/FloatingShapes.js
export default function FloatingShapes({ count = 12 }) {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              i % 2 === 0 ? "bg-[#9dbcf3]" : "bg-[#1d234e]"
            } animate-float-fast`}
            style={{
              width: `${20 + (i % 5) * 10}px`,
              height: `${20 + (i % 5) * 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + (i % 3) * 0.2,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>
    );
  }
  