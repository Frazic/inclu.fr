import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Meta tags */}
      {/* <!-- Primary Meta Tags --> */}
      <meta name="title" content="Inclure.net" />
      <meta name="description" content="Inclure.net: Site d'IA pour rendre les textes inclusifs" />

      {/* <!-- Open Graph / Facebook -- /> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://inclure.net/" />
      <meta property="og:title" content="Inclure.net" />
      <meta property="og:description" content="Inclure.net: Site d'IA pour rendre les textes inclusifs" />
      <meta property="og:image" content="https://gwytigvyfawwmshpjsas.supabase.co/storage/v1/object/public/img-bucket/inclure.webp" />

      {/* <!-- Twitter -- /> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://inclure.net/" />
      <meta property="twitter:title" content="Inclure.net" />
      <meta property="twitter:description" content="Inclure.net: Site d'IA pour rendre les textes inclusifs" />
      <meta property="twitter:image" content="https://gwytigvyfawwmshpjsas.supabase.co/storage/v1/object/public/img-bucket/inclure.webp" />

      {/* Google AdSense */}
      {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2195304651734956"
        crossOrigin="anonymous"
        type="text/partytown" /> */}

      {head.meta.map((m) => (
        <meta {...m} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
