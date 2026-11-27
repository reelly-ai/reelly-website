# Adding or editing news (blog posts)

News on reelly.ai are the blog posts at `https://reelly.ai/blog-posts/<slug>`, listed on `/blog`,
on the home page and at the bottom of most pages. They are plain Next.js pages ported from Webflow:
there is no CMS, a post is a folder of JSX files plus a card in every list that shows posts.

## Where a post lives

- `src/app/blog-posts/<slug>/page.tsx` — metadata (title, canonical, Open Graph image) and the page shell.
- `src/app/blog-posts/<slug>/_sections/S01BlogSektion.tsx` — header: category, title, lead paragraph, cover image.
- `src/app/blog-posts/<slug>/_sections/S02BlogSektion.tsx` — date, table of contents, article body (`w-richtext`).
- `src/app/blog-posts/<slug>/page.tsx` also lists the page's scripts (`page.scripts`): keep them as copied.
- `src/app/blog-posts/<slug>/_sections/S03WEmbed.tsx` — og:* meta tags (title, description, image, url).
- Images: `public/news/<slug>/` (new posts). Old posts use `/cdn/62a47d8c21acef8236283091/...`.

The sitemap picks up a new folder automatically (`src/app/sitemap.ts`).

## Where posts are listed (newest first)

| File | List | Card class | Items |
|---|---|---|---|
| `src/app/blog/_sections/S01BlogSection.tsx` | featured card at the top | `blog-news-card` | 1 (the newest post) |
| same | article list (mobile) | `blog-articles-block _1` | 10 |
| same | "Latest articles" (desktop) | `blog-articles-block` | 10 |
| same | "Updated" card | `blog-news-card` | 1 — leave as is unless asked |
| `src/app/_sections/S01BodyAgentsPart07.tsx` | home page blog slider | `agents-blog-card` | 10 |
| `src/components/webflow/AgentsSection.tsx` | blog slider on other pages | `agents-blog-card` | 10 |

## Adding a post

1. Pick a short slug in kebab-case (`reelly-x-partner-name`). Check the folder does not exist yet.
2. Copy the newest post folder (`src/app/blog-posts/reelly-brm-is-live-savills-is-in`) to the new slug.
3. In the copy, replace everywhere: title, category, lead paragraph, date (format `August 3, 2026`),
   article body, cover image, `canonical` (`/blog-posts/<slug>`), og:url (`<slug>`), og:description.
   - Body: keep the `w-richtext` wrapper; use `<h2>`, `<p>`, `<ul><li>`, `<strong>`, `<a href>`.
   - Table of contents (`blog-table-contents-block` in S02): plain text items, one `blog-contents-block`
     per `<h2>` of the body, with the same text. Short post without subheadings: remove the whole
     `blog-table-contents-block`.
   - Escape `'`, `"`, `{`, `}` in JSX text (`&apos;`, `&quot;`, or `{"…"}`).
4. Cover image: put the file in `public/news/<slug>/cover.jpg` (JPG/WebP, about 1600 px wide, under 400 KB)
   and reference it as `/news/<slug>/cover.jpg`. Drop the `srcSet`/`sizes` attributes of the old image.
5. Add the post as the **first** item of every list in the table above (copy the first item of that list,
   change href, image, category and title), and remove the last item of the lists that hold 10, so the
   count stays the same. The featured card on `/blog` shows only the new post.
6. Run `npm run build` — it must pass.
7. Commit on a new branch `news/<slug>`, push, open a pull request to `main`.
8. Open the Vercel preview link from the PR (bot comment), check the post page, `/blog` and the home page
   slider on desktop and mobile width. Then merge the PR: production updates in about a minute.

## Editing a post

Change the text in that post's `_sections` files. If the title, category or cover changes, update the same
fields in every list from the table above (search the repo for the post's slug). Then steps 6–8.

## Rules

- Change only the post's folder, `public/news/<slug>/` and the list files above. Nothing else.
- Keep Webflow class names and `data-w-id` attributes; styles and animations depend on them.
- Never delete or rename an existing post folder: its URL is indexed. To retire a post, ask a developer
  to add a redirect in `next.config.ts`.
- English only (the site has no other languages).
