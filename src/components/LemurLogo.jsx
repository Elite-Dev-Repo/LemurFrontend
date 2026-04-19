export default function LemurLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="24" rx="11" ry="10" fill="currentColor" />
      {/* Head */}
      <circle cx="20" cy="14" r="8" fill="currentColor" />
      {/* Ears */}
      <ellipse cx="12" cy="8" rx="3.5" ry="4.5" fill="currentColor" />
      <ellipse cx="28" cy="8" rx="3.5" ry="4.5" fill="currentColor" />
      <ellipse cx="12" cy="8" rx="2" ry="2.8" fill="var(--color-primary, #f8f6f2)" opacity="0.6"/>
      <ellipse cx="28" cy="8" rx="2" ry="2.8" fill="var(--color-primary, #f8f6f2)" opacity="0.6"/>
      {/* Face */}
      <circle cx="17" cy="13" r="2.2" fill="var(--color-primary, #f8f6f2)" />
      <circle cx="23" cy="13" r="2.2" fill="var(--color-primary, #f8f6f2)" />
      <circle cx="17.6" cy="12.4" r="0.9" fill="currentColor" />
      <circle cx="23.6" cy="12.4" r="0.9" fill="currentColor" />
      {/* Snout */}
      <ellipse cx="20" cy="16.5" rx="3" ry="2" fill="var(--color-primary, #f8f6f2)" opacity="0.5" />
      <circle cx="20" cy="16" r="0.8" fill="currentColor" />
      {/* Tail stripe detail */}
      <path d="M29 28 Q35 24 33 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M29 28 Q35 24 33 20" stroke="var(--color-primary, #f8f6f2)" strokeWidth="1.2" strokeLinecap="round" fill="none" strokeDasharray="2 2" />
    </svg>
  )
}
