import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "../main.css?inline";

export default component$(() => {
    useStyles$(styles);

    return (
        <div
            style={{
                "display": "flex",
                "flex-direction": "column",
                "place-items": "center",
                "width": "100vw",
                "position": "absolute",
                "top": "20%",
                "left": "50%",
                "transform": "translate(-50%, -50%)"
            }}>
            <h3
                style={{
                    "margin-inline": "auto"
                }}>
                Thank you for joining the waitlist!
            </h3>
            <p>You should have received an email :)</p>
            <a href="/"
                style={{
                    "text-decoration": "none"
                }}
            >
                <h1>🏠</h1>
            </a>
        </div>
    );
});

export const head: DocumentHead = () => {
    return {
        title: "Success",
    };
};