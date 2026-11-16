# Jacob Snowden

Personal site for Jacob Snowden: operations leadership, hand-coded web development, and marketing and social media. It is a single static page (HTML, CSS, and JavaScript) with no build step, so it can be hosted on GitHub Pages or Cloudflare Pages.

The resume is not in this repository and is not linked as a download. Employers request it through the form, and Jacob replies personally.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). Use a local server rather than opening `index.html` as a file. The resume form posts to an external HTTPS endpoint, which is unreliable from a `file://` page.

## Deploy on GitHub Pages

1. Merge this site to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then save.

The site will be published at:

[https://jacobsnowden180.github.io/Jacob-Snowden-Portfolio/](https://jacobsnowden180.github.io/Jacob-Snowden-Portfolio/)

A `.nojekyll` file is included so Pages serves the files as-is. Asset paths are relative, so the page works from that project URL without a build.

## Deploy on Cloudflare Pages

1. In Cloudflare Pages, create a project from this GitHub repository.
2. Framework preset: **None**.
3. Build command: leave empty.
4. Output directory: `/` (the repository root).

No environment variables are required.

## Custom domain

Canonical, Open Graph, Twitter, JSON-LD, `robots.txt`, and `sitemap.xml` use the GitHub Pages URL above. If you attach a custom domain, replace `https://jacobsnowden180.github.io/Jacob-Snowden-Portfolio` in:

- `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, and the JSON-LD `url` / `image`)
- `robots.txt`
- `sitemap.xml`

## Resume form

Submissions are delivered to **jacobsnowden180@gmail.com** by [FormSubmit](https://formsubmit.co/). There is no API key and no server.

The endpoint is set in one place, on the form in `index.html`:

```html
data-endpoint="https://formsubmit.co/ajax/jacobsnowden180@gmail.com"
```

`js/main.js` reads that attribute. To switch providers, change `data-endpoint` to another HTTPS URL that accepts a JSON `POST` and returns JSON with `"success": "true"` or `"success": true`.

The form checks name, company, work email, an optional phone number, the role being hired for, and a message. A hidden honeypot field (`_honey`) is included for spam. If that field is filled, the request is not sent. reCAPTCHA is turned off (`_captcha: false`) so the page can show its own success and error states. Until the address is activated, FormSubmit will not deliver messages.

### One-time activation

FormSubmit sends a confirmation email the first time the form is used. Open **jacobsnowden180@gmail.com**, find the message from FormSubmit (check spam), and click the activation link. After that, requests arrive in the inbox with a reply-to of the address the employer entered. The email subject is `Resume request from [Name] ([Company])`.

Nothing submitted through the form is stored in this repository or shown on the site.

## Headshot

`assets/images/jacob-snowden.jpg` and `assets/images/jacob-snowden.webp` are a cropped, compressed portrait derived from the original photo. Camera metadata was removed. `assets/images/og.jpg` is the social sharing image (1200×630).

## What this site intentionally leaves out

No employer name, no pay figures, no education or certifications, no testimonials, and no social profiles. Project descriptions stay general: custom hand-coded websites and marketing work for small businesses, without invented client names or figures.
