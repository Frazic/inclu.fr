import { $, component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
// import { MenuBurgerIcon } from '~/components/icons/menu-burger';
// import { GearIcon } from '~/components/icons/gear';
// import { Waitlist } from "~/components/waitlist/waitlist";
import styles from "./main.css?inline";
// import { Accordion } from "~/components/accordion/accordion";
import type { ToastStore } from "~/components/toast/toast";
import { Toast } from "~/components/toast/toast";
import { ResultBox } from "~/components/resultBox/resultBox";

export default component$(() => {
  useStyles$(styles);

  // THIS UPDATES THE TEXT RESULT RECEIVED FROM THE AI
  const inputValue = useSignal<string>("");
  const resultValue = useSignal<string>("");
  const setResultValue = $(async () => {
    console.log("Fetching")
    fetch("http://localhost:9333/transform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: inputValue.value
      })
    })
      .then(res => {
        return (res.json())
      })
      .then(body => {
        resultValue.value = body.response;
      })
      .catch(err => {
        console.log(err);
      })
  })

  const toastStore = useStore<ToastStore>({
    title: "",
    message: "",
    type: "error",
    active: false,
  });

  return (
    <>
      <section id="main">
        <header>
          <h1 id="title">INCLURE</h1>
        </header>

        {/* ACTION */}
        <div id="action" class={"flex"}>
          <form action="#" id="text-input-form" preventdefault:submit>
            <label for="text-input">
              <h2>Rendre inclusif:</h2>
            </label>
            <textarea name="text-input" id="text-input" cols={30} rows={10} about="Text input to be made inclusive" placeholder="L'Homme de Néanderthal" aria-label="text-input"
              onInput$={(ev, el: HTMLTextAreaElement) => inputValue.value = el.value}
            />
            <div id="input-buttons">
              <button id="go" role="button" type="submit"
                onClick$={setResultValue}>GO</button>
              {/* <div id="options" role="button">
                <GearIcon />
              </div> */}
            </div>
            <ResultBox value={resultValue.value} />
          </form>
        </div>

        {/* WAITLIST */}
        {/* <Waitlist
          success$={() => {
            toastStore.title = "Succès";
            toastStore.message = "Merci d'avoir rejoint la liste!";
            toastStore.type = "sucess";
            toastStore.active = true;
          }}
          error$={(error: string) => {
            toastStore.title = "Erreur";
            toastStore.message = `${error}`;
            toastStore.type = "error";
            toastStore.active = true;
          }}
        /> */}

        {/* ABOUT */}
        <div id="about" class={"flex"}>
          <h2>À propos</h2>
          <p id="about-text">
            Nous avons la conviction que faire de notre mieux pour être
            inclusif·ves dans notre écriture est crucial dans la société
            d'aujourd'hui. Cet outil vous permettra d'utiliser la puissance de
            l'IA pour vous aider. Il suffira de rentrer votre texte, appuyer sur
            'GO' et l'outil fera de son mieux pour le transformer en incluant
            tout le monde.
          </p>
          <p>
            Vous avez peut-être pu remarquer la police d'écriture :{" "}
            <a href="https://opendyslexic.org/">OpenDyslexic</a>
          </p>
        </div>

        {/* EXAMPLES */}
        <div id="examples" class="flex">
          <h2>Exemples</h2>
          <div id="examples-container">
            <div class="example-item">
              <div class="example-input">
                L'Homme de Néandertal est un groupe disparu d'hommes fossiles
                apparus en Eurasie il y a environ 45 000 ans
              </div>
              <i class="fa-solid fa-arrow-down" />
              <i class="fa-solid fa-arrow-right" />
              <div class="example-output">
                Les Néandertaliens étaient un groupe d'êtres humains fossiles
                qui ont vécu en Eurasie occidentale il y a environ 45 000 ans.
              </div>
            </div>
            <div class="example-item">
              <div class="example-input">
                Les enseignants ont besoin de formation pour aborder les
                questions de diversité dans leur classe.
              </div>
              <i class="fa-solid fa-arrow-down" />
              <i class="fa-solid fa-arrow-right" />
              <div class="example-output">
                Les enseignant·e·s ont besoin de formation pour aborder les
                questions de diversité dans leur classe.
              </div>
            </div>
            <div class="example-item">
              <div class="example-input">
                Les auteurs ont soumis leur manuscrit pour le concours
                littéraire.
              </div>
              <i class="fa-solid fa-arrow-down" />
              <i class="fa-solid fa-arrow-right" />
              <div class="example-output">
                Les auteurices ont soumis leur manuscrit pour le concours
                littéraire.
              </div>
            </div>
            <div class="example-item">
              <div class="example-input">
                Malgré son handicap, elle se bat pour défendre les violences faites aux femmes.
              </div>
              <i class="fa-solid fa-arrow-down" />
              <i class="fa-solid fa-arrow-right" />
              <div class="example-output">
                Elle se bat pour défendre les violences faites aux femmes.
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        {/* <div id="pricing" class={"flex"}>
          <h2>Abonnements</h2>
          <Accordion />
        </div> */}

        <Toast store={toastStore} />
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: "Inclure.net",
  meta: [
    {
      name: "Inclure.net",
      content: "Use AI to make your texts inclusive",
    },
  ],
};
