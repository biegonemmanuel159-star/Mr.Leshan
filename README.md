# Mr Leshan — GitHub Pages Website

This is the **GitHub Pages-ready** version of the Mr Leshan Computer & ICT website.

## What is included

- Responsive Mr Leshan profile website
- Uploaded profile photograph
- Profile, education, skills, interests and projects
- Grade 10 ICT notes (Terms 1–3)
- Grade 10 Computer Science notes (Terms 1–3)
- Notes search and category filter
- Light/dark theme switch
- Browser-based profile editing
- Local browser uploads for additional notes/photo
- Website link saving and best-effort browser import

## Publish on GitHub Pages

GitHub Pages needs the publishing source to contain `index.html` at its top level. This package is already arranged that way.

1. Open your GitHub repository: `Mr.Leshan`.
2. Replace/upload the files in this package into the repository root.
3. Make sure these are at the root level:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `profile.jpeg.png`
   - `notes/`
   - `.nojekyll`
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select your main branch and **/(root)**, then Save.
7. Wait for the Pages deployment to complete and refresh your site.

The live project URL should be:
`https://biegonemmanuel159-star.github.io/Mr.Leshan/`

## Important GitHub Pages limitation

GitHub Pages is static hosting. It does not run the original Node/Express `server.js`. The website therefore uses browser-side JavaScript. The website importer can only read another website when that website allows browser cross-origin access (CORS). The app also lets you save website links even when direct importing is blocked.

Additional files uploaded through the website are stored in the browser's local storage, so they are not automatically shared with other visitors or devices. For permanent multi-user storage, use a backend/database service.
