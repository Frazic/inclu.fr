import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <header>
        {/* <div class="googleAd top">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2195304651734956"
            crossOrigin="anonymous"
            type="text/partytown" />
          <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-2195304651734956"
            data-ad-slot="4684868358"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
          <script type="text/partytown">
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div> */}
      </header>
      <main>
        <section style={{ "position": "relative" }}>
          <Slot />
        </section>
      </main>
      <footer>
        <p>
          Attention : Une IA pouvant se tromper ou mal interpréter, les
          résultats ne pourront jamais être garantis à 100 %. Il en dépend de
          l'utilisateurice de vérifier ce que propose l'IA. Inclure.net ne peut
          être tenu responsable des textes proposés par l'IA.
        </p>
        <div class="links"
          style={{
            "display": "flex",
            "gap": "2em"
          }}>
          <a href="mailto:inclure.net@gmail.com">
            <h2>Contact</h2>
          </a>
          <a href="/confidentiality">
            <h2>Confidentialité</h2>
          </a>
        </div>
        {/* <div class="googleAd bottom">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2195304651734956"
            crossOrigin="anonymous"
            type="text/partytown" />
          <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-2195304651734956"
            data-ad-slot="4684868358"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
          <script type="text/partytown">
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div> */}
      </footer>
    </>
  );
});
