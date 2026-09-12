import { useEffect, useState } from 'react'

/* rootMargin taken verbatim from the reference so the highlighted nav item flips at the
   same scroll position. */
const OPTIONS = { rootMargin: '-25% 0px -65% 0px', threshold: 0 }

export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id)
      })
    }, OPTIONS)

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return { activeId, setActiveId }
}
