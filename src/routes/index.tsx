import { component$, useStyles$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { GearIcon } from '~/components/icons/gear';
import { MenuBurgerIcon } from '~/components/icons/menu-burger';
import styles from "./main.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (<>
    <section id="main">
      <header>
        <div id="menu-btn" class={"flex"} role="button">
          <MenuBurgerIcon />
        </div>
        <h1 id="title">INCLURE</h1>
      </header>
      <div id="action" class={"flex"}>
        <h3>Make inclusive</h3>
        <input type="text" id="text-input" />
        <div id="input-buttons">
          <button id="go" role="button">GO</button>
          <div id="options" role="button">
            <GearIcon />
          </div>
        </div>
      </div>
      <div id="about" class={"flex"}>
        <h3>About</h3>
        <p id="about-text">
          We believe that doing our best to include everyone is crucial in today's society. This tool will help you do that thanks to the power of AI! Just input your text and hit 'GO' and it'll do its best to transform it so that no one is excluded or forgotten.
        </p>
        <p>You may have also noticed the special font: <a href="https://opendyslexic.org/">OpenDyslexic</a></p>
      </div>
      <div id="pricing" class={"flex"}>
        <h3>Pricing</h3>
        <div class="accordion"></div>
        <div class="accordion"></div>
      </div>
    </section>
  </>);
});

export const head: DocumentHead = {
  title: 'Inclure.net',
  meta: [
    {
      name: 'Inclure.net',
      content: 'Use AI to make your texts inclusive',
    },
  ],
};
