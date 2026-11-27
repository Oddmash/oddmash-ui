if (navigator.clipboard?.writeText) {
  for (const frame of document.querySelectorAll('.code-frame')) {
    const code = frame.querySelector('pre > code');
    if (!code) continue;
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Copy code';
    button.addEventListener('click', async () => {
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(code.textContent);
        status.textContent = 'Copied';
      } catch {
        status.textContent = 'Select the code to copy it';
      }
    });
    toolbar.append(status, button);
    frame.prepend(toolbar);
  }
}
