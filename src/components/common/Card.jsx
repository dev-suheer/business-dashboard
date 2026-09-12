export default function Card({ className = '', children }) {
  return (
    <div className={`rounded-xl border border-line/70 bg-panel/50 p-5 ${className}`.trim()}>
      {children}
    </div>
  )
}
