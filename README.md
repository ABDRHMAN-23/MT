# Panorama Hotel Aden

Premium bilingual hotel website for Panorama Hotel Aden, Aden, Yemen.

## Stack
- React + TypeScript + Vite
- Supabase
- Responsive RTL/LTR experience
- Vercel-ready deployment

## Content
Rooms & suites, booking request flow, services, dining, experiences, gallery, offers, reviews, FAQ, contact and hotel information.

## Data
Hotel content and booking requests are stored in the `pano_*` Supabase tables in the connected project.


## Admin control center
- Public site: `/`
- Protected admin: `/admin`
- The dashboard controls hotel identity, logo, colors, typography, contact channels, social links, SEO, hero, editable sections, rooms, services, FAQs, gallery, offers and booking-request statuses.
- Authentication uses Supabase Auth. For safety, only users whose UUID exists in `public.pano_admins` are allowed into the dashboard.
- Create the manager account in Supabase Auth, then add that user's UUID to `public.pano_admins`.
- Public content is read through the publishable Supabase client; no service-role key is used in the browser.
