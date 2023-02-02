import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <header>
        <div class="googleAd top"></div>
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
        <a href="mailto:inclure.net@gmail.com">
          <h2>Contact</h2>
        </a>
        <div class="googleAd bottom"></div>
      </footer>
    </>
  );
});
