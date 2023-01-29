import type { PropFunction } from "@builder.io/qwik";
import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./waitlist.css?inline";

export interface WaitlistProps {
  success$: PropFunction<() => void>;
  error$: PropFunction<(error: string) => void>;
}

export const Waitlist = component$<WaitlistProps>((props) => {
  useStylesScoped$(styles);

  const submit = $(async () => {
    const nameElement = document.getElementById(
      "name"
    ) as HTMLInputElement | null;
    const emailElement = document.getElementById(
      "email"
    ) as HTMLInputElement | null;
    // const donateCheck = document.getElementById(
    //   "checkbox-donate"
    // ) as HTMLInputElement | null;
    // if (!(nameElement && emailElement && donateCheck)) return;
    if (!(nameElement && emailElement)) return;

    const name = nameElement.value;
    const email = emailElement.value;
    // const donated = donateCheck.checked;

    const controller = new AbortController();

    // 5 second timeout:
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 5000)

    fetch(`${import.meta.env.VITE_SERVER_URL}/join`, {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test: 0,
        user_info: {
          name: name,
          email: email,
          // donated: donated,
        },
      }),
    })
      .then((res) => {
        clearTimeout(timeoutId);
        try {
          return res.json();
        } catch (error) {
          return res.json().then((json) => Promise.reject(json));
        }
      })
      .then((body) => {
        if (body.error) {
          console.error(body.error);
          props.error$(body.error);
        } else {
          // Redirect to stripe url
          if (body.url) {
            window.location = body.url;
          }
          console.info("Success: Waitlist registration complete");
          props.success$();
        }
      })
      .catch(err => {
        if (err.name === "AbortError") {
          console.error(err);
          props.error$("La requête au serveur a échouée :c");
        }
        if (err.name === "TypeError") {
          console.error(err);
          if (err.message === "NetworkError when attempting to fetch resource.") {
            props.error$("Serveur injoignable :c");
          }
        }
        else {
          console.error(err);
          props.error$(`${err.name}: ${err.message}`);
        }
      });
  });

  return (
    <div id="waitlist">
      <form onSubmit$={submit} id="waitlist-form" preventdefault:submit>
        <h2>Rejoignez la liste d'attente</h2>
        <label for="name">Nom</label>
        <input
          type={"text"}
          name="name"
          id="name"
          contentEditable="true"
          required
        />

        <label for="email">E-mail</label>
        <input
          type={"email"}
          name="email"
          id="email"
          contentEditable="true"
          required
        />

        {/* <input name="donate" id="checkbox-donate" type="checkbox" />
        <label for="checkbox-donate">
          {" "}
          Optionnel: Faites une donation pour recevoir 3 mois d'abonnement Pro au lancement!
        </label> */}

        <button role={"button"} type="submit">
          Rejoindre
        </button>
      </form>
    </div>
  );
});
