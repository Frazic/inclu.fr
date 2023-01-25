import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (<>
    <div>Hello World</div>
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
