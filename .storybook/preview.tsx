import React from 'react';
import type { Preview } from '@storybook/react';

import '../src/styles/primitives.css';
import '../src/styles/tokens.css';

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
}

// Add a theme toggle button
if (typeof window !== 'undefined') {
  const btn = document.createElement('button');
  btn.textContent = '🌓 Toggle theme';
  btn.style.cssText =
    'position:fixed;bottom:1rem;right:1rem;z-index:9999;padding:0.4rem 0.8rem;' +
    'border:1px solid var(--uil-border);border-radius:var(--uil-radius-md);' +
    'background:var(--uil-bg);color:var(--uil-fg);cursor:pointer;' +
    'font-family:var(--uil-font-sans);font-size:var(--uil-font-size-sm);' +
    'box-shadow:var(--uil-shadow-md);';
  btn.onclick = toggleTheme;
  document.body?.appendChild(btn);
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: 'var(--uil-font-sans, system-ui, sans-serif)' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
