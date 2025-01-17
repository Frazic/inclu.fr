import {
  $,
  component$,
  useSignal,
  useStore,
  useStyles$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
// import { GearIcon } from '~/components/icons/gear';
import styles from "./main.css?inline";
import type { ToastStore } from "~/components/toast/toast";
import { Toast } from "~/components/toast/toast";

export default component$(() => {
  useStyles$(styles);

  const toastStore = useStore<ToastStore>({
    title: "",
    message: "",
    type: "error",
    active: false,
  });

  const serverUrl: string = import.meta.env.VITE_SERVER_URL;

  const serverHasBeenPinged = useSignal<boolean>(false);
  const inputValue = useSignal<string>("");
  const inputMaxCharacters = 1000;

  const resultValue = useSignal<string>("");
  const resultIsLoading = useSignal<boolean>(false);

  const resultDatabaseID = useSignal<number | null>(null);

  const handleInput$ = $((input: string) => {
    if (!serverHasBeenPinged.value) {
      // Ping the server once to wake it
      fetch(serverUrl, {
        method: "GET",
      });
      serverHasBeenPinged.value = true;
    }

    inputValue.value = input;
  });

  const sendPrompt$ = $(async () => {
    resultValue.value = "";

    if (!inputValue.value || inputValue.value === "" || inputValue.value.length === 0) return;

    resultIsLoading.value = true;

    fetch(`${serverUrl}/transform`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: inputValue.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        resultIsLoading.value = false;
        resultValue.value = body.response;
        resultDatabaseID.value = body.database_id;
      })
      .catch((err) => {
        resultIsLoading.value = false;
        toastStore.title = "Erreur";
        toastStore.message =
          "Une erreur est survenue, merci de me contacter si cela persiste :c";
        toastStore.active = true;
        console.log({ err });
      });
  });

  const sendFeedback$ = $(async (type: "good" | "bad") => {
    if (!resultDatabaseID.value) return;

    fetch(`${serverUrl}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: resultDatabaseID.value,
        type: type
      }),
    })
      .then(() => {
        toastStore.type = "success";
        toastStore.title = "Bien reçu!";
        toastStore.message = "Merci pour votre retour :)"
        toastStore.active = true;
      })
  })

  return (
    <>
      <section id="main">
        <header>
          <h1 id="title">INCLURE</h1>
        </header>

        {/* ACTION */}
        <div id="action">
          <form action="#" id="text-input-form" preventdefault:submit>
            <label for="text-input">
              <h2>Rendre inclusif:</h2>
            </label>
            <div id="text-input-wrapper">
              <textarea
                name="text-input"
                id="text-input"
                cols={30}
                rows={3}
                maxLength={inputMaxCharacters}
                about="Text input to be made inclusive"
                placeholder="L'Homme de Néanderthal"
                aria-label="text-input"
                onInput$={(ev, el: HTMLTextAreaElement) => {
                  handleInput$(el.value);
                }}
              />
              <span id="text-input-character-count">{inputMaxCharacters - inputValue.value.length}</span>
            </div>
            <div id="input-buttons">
              <button id="go" role="button" type="submit" onClick$={sendPrompt$}>
                GO
              </button>
              {/* <div id="options" role="button">
                <GearIcon />
              </div> */}
            </div>
            <label for="result-box">
              <h2>
                {resultIsLoading.value
                  ? "Chargement..."
                  : resultValue.value
                    ? "Résultat:"
                    : ""}
              </h2>
            </label>
            <textarea
              name="result-box"
              id="result-box"
              class={resultValue.value ? "visible" : ""}
              contentEditable="false"
              cols={30}
              rows={3}
              value={resultValue.value}
            />
            <div
              id="feedback-buttons"
              class={resultValue.value ? "visible" : ""}
            >
              <button
                id="feedback-btn good"
                title="Bon résultat"
                aria-label="Bon résultat"
                onClick$={() => sendFeedback$("good")}
              >
                👍
              </button>
              <button
                id="feedback-btn bad"
                title="Mauvais résultat"
                aria-label="Mauvais résultat"
                onClick$={() => sendFeedback$("bad")}
              >
                👎
              </button>
            </div>
          </form>
        </div>

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
                Malgré son handicap, elle se bat pour défendre les violences
                faites aux femmes.
              </div>
              <i class="fa-solid fa-arrow-down" />
              <i class="fa-solid fa-arrow-right" />
              <div class="example-output">
                Elle se bat pour défendre les violences faites aux femmes.
              </div>
            </div>
          </div>
        </div>

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
