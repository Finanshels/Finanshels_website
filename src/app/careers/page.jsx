import { redirect } from 'next/navigation'

// Careers now lives on the external hiring site. Any direct hit to /careers
// (old links, bookmarks, search results) redirects there; the nav/footer
// "Careers" buttons link to it directly and open in a new tab.
export default function CareersRoute() {
  redirect('https://careers.finanshels.com/')
}
