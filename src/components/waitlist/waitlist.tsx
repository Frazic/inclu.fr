import type { PropFunction } from "@builder.io/qwik";
import { $, component$, useClientEffect$, useStylesScoped$ } from "@builder.io/qwik";
import emailjs from "@emailjs/browser";
import styles from "./waitlist.css?inline";

export interface WaitlistProps {
    success$: PropFunction<() => void>,
    error$: PropFunction<(error: string) => void>,
}

export const Waitlist = component$<WaitlistProps>((props) => {
    useStylesScoped$(styles);

    const submit = $(() => {
        const nameElement = document.getElementById("name") as HTMLInputElement | null;
        const emailElement = document.getElementById("email") as HTMLInputElement | null;
        const donateCheck = document.getElementById("checkbox-donate") as HTMLInputElement | null;
        if (!(nameElement && emailElement && donateCheck)) return;

        const name = nameElement.value;
        const email = emailElement.value;
        const donated = donateCheck.checked;

        const templateParams = {
            user_name: name,
            user_email: email,
            user_donated: donated
        }

        // FOR TESTING PURPOSES
        // TODO REMOVE
        if (Math.random() > 0.5) {
            props.success$();
            const form = document.getElementById("waitlist-form") as HTMLFormElement;
            form?.reset();
        } else {
            props.error$("Error message");
        }

        // emailjs.send("service_de9mf33", "template_wugxd3j", templateParams)
        //     .then(function (response) {
        //         console.log('SUCCESS!', response.status, response.text);
        //         props.success$();
        //     }, function (error) {
        //         console.log('FAILED...', error);
        //         props.error$();
        //     });
    })

    useClientEffect$(() => {
        emailjs.init("HMv3N68qZ2Rn62K0m")
    })

    return (
        <div id="waitlist">
            <form onSubmit$={submit} id="waitlist-form" preventdefault:submit>
                <h3>Join our waitlist</h3>
                <label for="name">Name</label>
                <input type={"text"} name="name" id="name" contentEditable="true" required />

                <label for="email">E-mail</label>
                <input type={"email"} name="email" id="email" contentEditable="true" required />

                <input name="donate" id="checkbox-donate" type="checkbox" />
                <label for="donate"> Optional: Pay $5 once and receive a 6 month Pro plan at launch</label>

                <button role={"button"} type="submit">Join</button>
            </form>
        </div>
    );
});