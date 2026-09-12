import logoUrl from '../../assets/logo.png'

/* Decorative — every placement sits beside the wordmark, so alt is intentionally empty
   to keep screen readers from announcing the name twice. */
export default function Logo({ className = 'h-8 w-8' }) {
  return (
    <img
      src={logoUrl}
      alt=""
      className={`${className} shrink-0 rounded-md border border-emerald/25 object-cover`}
    />
  )
}
