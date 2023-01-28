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
    const donateCheck = document.getElementById(
      "checkbox-donate"
    ) as HTMLInputElement | null;
    if (!(nameElement && emailElement && donateCheck)) return;

    const name = nameElement.value;
    const email = emailElement.value;
    const donated = donateCheck.checked;

    fetch(`${import.meta.env.VITE_SERVER_URL}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test: 0,
        user_info: {
          name: name,
          email: email,
          donated: donated,
        },
      }),
    })
      .then((res) => {
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
      });
  });

  return (
    <div id="waitlist">
      <form onSubmit$={submit} id="waitlist-form" preventdefault:submit>
        <h3>Rejoingez la liste d'attente</h3>
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
