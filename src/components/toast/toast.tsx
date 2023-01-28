import {
  $,
  component$,
  useClientEffect$,
  useStylesScoped$,
} from "@builder.io/qwik";
import styles from "./toast.css?inline";

export interface ToastStore {
  title: string;
  message: string;
  type: "sucess" | "error";
  active: boolean;
}

export interface ToastProps {
  store: ToastStore;
}

export const Toast = component$<ToastProps>((props) => {
  useStylesScoped$(styles);

  const clearToast = $(() => {
    props.store.active = false;
    setTimeout(() => {
      props.store.title = "";
      props.store.message = "";
      props.store.type = "error";
    }, 400);
  });

  useClientEffect$(({ track }) => {
    track(props.store);
    const timeout = setTimeout(clearToast, 3000);
    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div
      class={`toast-container ${props.store.type} ${
        props.store.active ? "active" : ""
      }`}
      id="toast"
    >
      <div class="toast-info">
        <button role={"button"} onClick$={clearToast}>
          X
        </button>
        <p class="title">{props.store.title}</p>
        <p class="message">{props.store.message}</p>
      </div>
    </div>
  );
});
