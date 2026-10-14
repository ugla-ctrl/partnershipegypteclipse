# Egypt Eclipse partnership minisite

Upload the CONTENTS of this folder into the root of the GitHub Pages publishing source. No build step or dependencies are required. Keep the assets folder intact.

## GitHub Pages
1. In the repository Settings → Pages, select the publishing branch and folder containing index.html.
2. Set the custom domain to partnership.egypt-eclipse.com. The supplied CNAME file contains this value.
3. In your DNS provider, create a CNAME record named partnership targeting the Pages account hostname, <owner>.github.io, without a repository path. If using your existing ugla-ctrl account, that target is ugla-ctrl.github.io.
4. When GitHub’s DNS check and certificate are ready, enable Enforce HTTPS.

Official guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

This package does not publish the site or change DNS. Set the Pages custom domain before the DNS record. Certificate provisioning can take time.

## Included
18 cinematic chapters, responsive detail panels, a comparison table, map zoom, chapter navigation, reduced motion and pause controls. All fonts and photographs are local. Contact buttons open a branded enquiry popup. Submissions go directly to Customer.io hosted Forms (Egypt Eclipse workspace), then return to the invitation with a thank-you confirmation. The form collects email, optional name/company, selected partnership level, and contact-request context. The running “Egypt Eclipse | Partnership enquiries” automation sends an internal notification to mitch@imxp.org. No private API key is included in this package.

Title: Egypt Eclipse 2027 | Your Partnership Invitation
Description: Join a global community for ten days along the Nile, six minutes of totality, and extraordinary experiences in Luxor and Giza. Explore Egypt Eclipse partnerships.
Standard emblem favicon and Apple icon. Threshold-cover social image at 1200×630. Canonical URL, Open Graph, Twitter card, sitemap and robots.txt are included.

## Editing
index.html contains copy, scene order, and detail templates. immersive.css styles the cinematic experience; continuation.css styles details; journey.css styles the opening sequence. immersive.js controls navigation and motion. Keep scene order and the chapter-menu data-go values synchronized when adding scenes.

Preview through a local HTTP server, or use the separately supplied standalone HTML preview. The live social image uses the intended domain and will resolve after publishing.
