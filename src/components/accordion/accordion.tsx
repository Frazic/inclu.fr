import { $, component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
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
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor ab, dolores temporibus fuga atque odit, corrupti ea incidunt magni voluptatibus aliquid omnis, beatae unde repudiandae adipisci delectus labore harum error.</p>
                </div>
            </div>
            <div class="accordion-item">
                <div class="accordion-header" onClick$={() => activeItem.value = [false, !activeItem.value[1]]}>
                    <h4>Pro</h4>
                    <i class={`fa-solid fa-plus ${!activeItem.value[1] ? " active" : ""}`}></i>
                    <i class={`fa-solid fa-minus ${activeItem.value[1] ? " active" : ""}`}></i>
                </div>
                <div class={`accordion-answer ${activeItem.value[1] ? " active" : ""}`}>
                    <p>Quos fugiat animi recusandae aperiam error vitae, facilis, a quo eos expedita voluptate labore ipsum dolor dolorum repellendus soluta temporibus rerum omnis perspiciatis, unde numquam velit cupiditate incidunt! Eos, voluptas.</p>
                </div>
            </div>
        </div>
    )
});