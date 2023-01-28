import { component$, useStore, useStyles$ } from '@builder.io/qwik';
// import { $, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
// import { MenuBurgerIcon } from '~/components/icons/menu-burger';
// import { GearIcon } from '~/components/icons/gear';
// import { ResultBox } from '~/components/resultBox/resultBox';
import { Waitlist } from '~/components/waitlist/waitlist';
import styles from "./main.css?inline";
import { Accordion } from '~/components/accordion/accordion';
import type { ToastStore } from '~/components/toast/toast';
import { Toast } from '~/components/toast/toast';

export default component$(() => {
  useStyles$(styles);

  // THIS UPDATES THE TEXT RESULT RECEIVED FROM THE AI
  // const resultValue = useSignal<string>("");
  // const setResultValue = $(() => {
  //   const textInput = document.getElementById("text-input") as HTMLTextAreaElement | null;
  //   if (!textInput) return;
  //   console.log(textInput.value)
  //   resultValue.value = textInput.value;
  // })

  const toastStore = useStore<ToastStore>({
    title: "",
    message: "",
    type: "error",
    active: false
  })

  return (<>
    <section id="main">
      <header>
        {/* <div id="menu-btn" class={"flex"} role="button">
          <MenuBurgerIcon />
        </div> */}
        <h1 id="title">INCLURE</h1>
      </header>
      {/* <div id="action" class={"flex"}>
        <form action="#" id="text-input-form" preventdefault:submit>
          <label for="text-input">
            <h3>Make inclusive:</h3>
          </label>
          <textarea name="text-input" id="text-input" cols={30} rows={10} about="Text input to be made inclusive" placeholder="L'Homme de Néanderthal" aria-label="text-input"
          />
          <div id="input-buttons">
            <button id="go" role="button" type="submit"
              onClick$={setResultValue}>GO</button>
            <div id="options" role="button">
              <GearIcon />
            </div>
          </div>
          <ResultBox value={resultValue.value} />
        </form>
      </div> */}
      <Waitlist
        success$={() => { toastStore.title = "Success"; toastStore.message = "Thanks for joining the waitlist!"; toastStore.type = "sucess"; toastStore.active = true }}
        error$={(error: string) => { toastStore.title = "Error"; toastStore.message = `${error}`; toastStore.type = "error"; toastStore.active = true }}
      />
      <div id="about" class={"flex"}>
        <h3>About</h3>
        <p id="about-text">
          We believe that doing our best to include everyone is crucial in today's society. This tool will help you do that thanks to the power of AI! Just input your text, hit 'GO' and it'll do its best to transform it so that no one is excluded or forgotten.
        </p>
        <p>You may have also noticed the special font: <a href="https://opendyslexic.org/">OpenDyslexic</a></p>
      </div>

      {/* EXAMPLES */}
      <div id="examples" class="flex">
        <h3>Examples</h3>
        <div id="examples-container">
          <div class="example-item">
            <div class="example-input">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum magnam ullam tempore nobis. Magni doloremque id, est repellat velit amet ipsam, modi blanditiis enim, dolorem itaque ea corrupti illo minima!</div>
            <i class="fa-solid fa-arrow-right" />
            <div class="example-output">Out</div>
          </div>
          <div class="example-item">
            <div class="example-input">In</div>
            <i class="fa-solid fa-arrow-right" />
            <div class="example-output">Out</div>
          </div>
          <div class="example-item">
            <div class="example-input">In</div>
            <i class="fa-solid fa-arrow-right" />
            <div class="example-output">Out</div>
          </div>
        </div>
      </div>

      <div id="pricing" class={"flex"}>
        <h3>Pricing</h3>
        <Accordion />
      </div>
      <Toast store={toastStore} />
    </section>
    <footer>
      <p>Disclaimer:</p>
      <a href="mailto:inclure.net@gmail.com">
        <h3>Contact</h3>
      </a>
    </footer>
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
