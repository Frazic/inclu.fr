import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./waitlist.css?inline";

export const Waitlist = component$(() => {
    useStylesScoped$(styles);

    const submit = $(() => {
        const donateCheck = document.getElementById("checkbox-donate") as HTMLInputElement | null;
        if (!donateCheck) return;

        const isChecked = donateCheck.checked;
        console.log(isChecked);
    })

    return (
        <div id="waitlist">
            <form action="#" preventdefault:submit>
                <h3>Join our waitlist</h3>
                <label for="name">Name</label>
                <input type={"text"} name="name" id="textarea-name" contentEditable="true" required />

                <label for="email">E-mail</label>
                <input type={"email"} name="email" id="textarea-email" contentEditable="true" required />

                <input name="donate" id="checkbox-donate" type="checkbox" />
                <label for="donate"> Optional: Pay $5 once and receive a 6 month Pro plan upon launch</label>
                <button role={"button"} type="submit" onClick$={submit}>Join</button>
            </form>
        </div>
    );
});