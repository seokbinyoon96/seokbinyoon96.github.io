# Writing blog posts

Posts appear at `/blog/` and never on the homepage. The navigation menu links to
the blog between `service` and `cv`. Posts are listed newest first.

## Publish from GitHub

1. Open the repository's `_posts` folder.
2. Choose **Add file → Create new file**.
3. Name the file `YYYY-MM-DD-short-title.md`, for example
   `2026-10-04-my-first-post.md`. Use a unique English filename slug; the visible
   title and body can be in Korean or English.
4. Paste the template below and replace the title, description, and body.
5. Choose **Commit changes** and commit to `main`.
6. Wait for the **pages build and deployment** workflow in **Actions** to finish.
   The post will appear in the blog automatically. No menu or index editing is needed.

```markdown
---
title: "My first post"
description: "A short summary for the blog list."
lang: en
---

Write your post here.

## A section

More text, **bold text**, and [a link](https://example.com).
```

Set `lang: ko` for Korean posts. `description` is optional. Keep the opening and
closing `---` lines: they mark the metadata that Jekyll needs. Quote titles,
especially if they contain a colon. Escape a double quote inside a quoted title
with a backslash, or use single quotes around the title.

`2026-10-04-my-first-post.md` becomes `/blog/my-first-post/`. The filename date
sets the publication date. To set an exact time, add e.g.
`date: 2026-10-04 14:00:00 -0400` to the metadata.

## Images

Upload images using **Add file → Upload files** in `images/blog/`, then write:

```markdown
![Descriptive alternative text](/images/blog/my-image.png)
```

## Drafts and publication dates

Copy `_drafts/post-template.md` to start a draft. Files in `_drafts` do not appear
on the website. To publish, move the file into `_posts` and give it a dated name.
Alternatively, add `published: false` to a post's metadata; remove it to publish.

The repository is public: draft source is visible on GitHub even though it is
not displayed on the website. Keep private notes outside the repository.

Future-dated posts are excluded until a build runs after their date. GitHub Pages
does not automatically rebuild just because a date arrives. Commit on the desired
publication date, or trigger a new Pages deployment then.

## Edit an existing post

Open its Markdown file in `_posts`, choose the pencil icon, edit, and commit.
Keep the filename slug unchanged to preserve the post URL.

For local previews, use `jekyll serve`; to include drafts, use
`jekyll serve --drafts`. No editor or plugin installation is required when writing
through GitHub.

## Equations

MathJax renders equations on post pages automatically. Use Kramdown's `$$`
delimiters for both inline and display equations.

Inline: `The coefficient is $$\alpha$$.`

Display (leave blank lines before and after):

```text
$$
J = J_{\text{safety}} + \alpha J_{\text{efficiency}}
$$
```

Avoid raw `\(...\)` and `\[...\]` in Markdown: Markdown can remove their
backslashes before rendering. Do not put equations in code fences unless you want
to show their source. Add `math: false` to front matter to disable MathJax on a post.

## Temporary pause

The blog is currently disabled. Post sources remain in `_posts/`.
To reopen, set `blog_enabled: true` in `_config.yml` and remove `blog` and
`_posts` from its `exclude` list, then commit. Both steps are required.
While paused, the menu, blog index, and individual post pages are not published.
Source files are still visible in this public GitHub repository.
