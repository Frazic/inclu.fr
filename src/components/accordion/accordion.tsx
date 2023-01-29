import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./accordion.css?inline";

export const Accordion = component$(() => {
  useStylesScoped$(styles);
  const activeItem = useSignal<boolean[]>([false, false]);

  return (
    <div class="accordion">
      <div class="accordion-item">
        <div
          class="accordion-header"
          onClick$={() => (activeItem.value = [!activeItem.value[0], false])}
        >
          <h3>Gratuit</h3>
          <i
            class={`fa-solid fa-plus ${!activeItem.value[0] ? " active" : ""}`}
          ></i>
          <i
            class={`fa-solid fa-minus ${activeItem.value[0] ? " active" : ""}`}
          ></i>
        </div>
        <div class={`accordion-answer ${activeItem.value[0] ? " active" : ""}`}>
          <ul>
            <li>Accès à l'outil</li>
            <li>1000 mots/mois</li>
          </ul>
        </div>
      </div>
      <div class="accordion-item">
        <div
          class="accordion-header"
          onClick$={() => (activeItem.value = [false, !activeItem.value[1]])}
        >
          <h3>Pro</h3>
          <h3>5€/mois</h3>
          <i
            class={`fa-solid fa-plus ${!activeItem.value[1] ? " active" : ""}`}
          ></i>
          <i
            class={`fa-solid fa-minus ${activeItem.value[1] ? " active" : ""}`}
          ></i>
        </div>
        <div class={`accordion-answer ${activeItem.value[1] ? " active" : ""}`}>
          <ul>
            <li>Usage illimité</li>
            <li>Transformation personalisable</li>
            <li>Correction avant transformation</li>
            <li>Propositions multiples</li>
          </ul>
        </div>
      </div>
    </div>
  );
});
