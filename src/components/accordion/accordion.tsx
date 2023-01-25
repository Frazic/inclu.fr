import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./accordion.css?inline";

export const Accordion = component$(() => {
    useStylesScoped$(styles);
    const activeItem = useSignal<boolean[]>([false, false]);

    return (
        <div class="accordion">
            <div class="accordion-item">
                <div class="accordion-header" onClick$={() => activeItem.value = [!activeItem.value[0], false]}>
                    <h4>Free</h4>
                    <i class={`fa-solid fa-plus ${!activeItem.value[0] ? " active" : ""}`}></i>
                    <i class={`fa-solid fa-minus ${activeItem.value[0] ? " active" : ""}`}></i>
                </div>
                <div class={`accordion-answer ${activeItem.value[0] ? " active" : ""}`}>
                    <ul>
                        <li>Cool feature 1</li>
                        <li>Cool feature 2</li>
                        <li>Cool feature 3</li>
                        <li>Cool feature 4</li>
                        <li>Cool feature 5</li>
                    </ul>
                </div>
            </div>
            <div class="accordion-item">
                <div class="accordion-header" onClick$={() => activeItem.value = [false, !activeItem.value[1]]}>
                    <h4>Pro</h4>
                    <i class={`fa-solid fa-plus ${!activeItem.value[1] ? " active" : ""}`}></i>
                    <i class={`fa-solid fa-minus ${activeItem.value[1] ? " active" : ""}`}></i>
                </div>
                <div class={`accordion-answer ${activeItem.value[1] ? " active" : ""}`}>
                    <ul>
                        <li>Cool feature 1</li>
                        <li>Cool feature 2</li>
                        <li>Cool feature 3</li>
                        <li>Cool feature 4</li>
                        <li>Cool feature 5</li>
                    </ul>
                </div>
            </div>
        </div>
    )
});