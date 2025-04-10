export function Card({ className = "", children }) {
  return <div className={`rounded-2xl shadow p-4 bg-white ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}