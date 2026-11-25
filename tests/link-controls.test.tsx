import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { ButtonLink, IconButton, IconLink } from '../src/button';
import { Kbd } from '../src/kbd';
import { PlatformLink, PlatformLinks } from '../src/platform-link';

it('preserves native link props, ref, target and the current-page contract', async () => {
  const ref = createRef<HTMLAnchorElement>();
  const user = userEvent.setup();
  const handleClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
  render(
    <ButtonLink ref={ref} href="/docs/example" className="consumer-link" style={{ paddingInline: 8 }}
      variant="secondary" size="sm" target="_blank" rel="noopener" aria-current="page" onClick={handleClick}>
      Read docs
    </ButtonLink>,
  );
  const link = screen.getByRole('link', { name: 'Read docs' });
  expect(link).toBe(ref.current);
  expect(link).toHaveAttribute('href', '/docs/example');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener');
  expect(link).toHaveAttribute('aria-current', 'page');
  expect(link).toHaveClass('om-button', 'om-button--link', 'om-button--secondary', 'om-button--sm', 'consumer-link');
  expect(link.style.paddingInline).toBe('8px');
  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(handleClick).toHaveBeenCalledOnce();
});

it('keeps icon controls named, native and keyboard operable without implicit form submission', async () => {
  const buttonRef = createRef<HTMLButtonElement>();
  const linkRef = createRef<HTMLAnchorElement>();
  const onClick = vi.fn();
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
  const user = userEvent.setup();
  render(
    <form onSubmit={onSubmit}>
      <IconButton ref={buttonRef} aria-label="Open search" onClick={onClick}>
        <span aria-hidden="true">⌕</span>
      </IconButton>
      <span id="icon-link-label">Open reference</span>
      <IconLink ref={linkRef} aria-labelledby="icon-link-label" href="#reference" size="sm">
        <span aria-hidden="true">↗</span>
      </IconLink>
      <IconButton aria-label="Unavailable" disabled onClick={onClick}>
        <span aria-hidden="true">×</span>
      </IconButton>
    </form>,
  );
  const button = screen.getByRole('button', { name: 'Open search' });
  expect(button).toBe(buttonRef.current);
  expect(button).toHaveClass('om-button--icon', 'om-button--ghost');
  expect(button).toHaveAttribute('type', 'button');
  const link = screen.getByRole('link', { name: 'Open reference' });
  expect(link).toBe(linkRef.current);
  expect(link).toHaveClass('om-button--icon', 'om-button--link', 'om-button--sm');
  expect(link).toHaveAttribute('href', '#reference');
  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Space}');
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(2);
  expect(onSubmit).not.toHaveBeenCalled();
  await user.tab();
  expect(link).toHaveFocus();
  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
});

it('renders the requested platform mark without imposing destinations or target behavior', () => {
  const ref = createRef<HTMLAnchorElement>();
  const group = createRef<HTMLDivElement>();
  render(
    <PlatformLinks ref={group} className="consumer-platforms" role="group" aria-label="Project sources">
      <PlatformLink ref={ref} platform="github" href="/source" aria-label="View source" title="Repository" />
      <PlatformLink platform="npm" href="/packages" aria-label="Package registry" target="_blank" rel="noopener noreferrer" />
    </PlatformLinks>,
  );
  const github = screen.getByRole('link', { name: 'View source' });
  const npm = screen.getByRole('link', { name: 'Package registry' });
  expect(screen.getByRole('group', { name: 'Project sources' })).toBe(group.current);
  expect(group.current).toHaveClass('om-platform-links', 'consumer-platforms');
  expect(github).toBe(ref.current);
  expect(github).toHaveAttribute('href', '/source');
  expect(github).not.toHaveAttribute('target');
  expect(github).toHaveAttribute('data-platform', 'github');
  expect(github).toHaveAttribute('title', 'Repository');
  expect(github.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
  expect(github.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  expect(npm).toHaveAttribute('href', '/packages');
  expect(npm).toHaveAttribute('target', '_blank');
  expect(npm).toHaveAttribute('rel', 'noopener noreferrer');
  expect(npm).toHaveAttribute('data-platform', 'npm');
  expect(npm.querySelector('svg')).toHaveAttribute('viewBox', '0 0 32 12');
  expect(npm.querySelector('svg')).toHaveAttribute('focusable', 'false');
});

it('uses native kbd markup and supports static rendering without a document', () => {
  const ref = createRef<HTMLElement>();
  render(<Kbd ref={ref} className="shortcut" lang="en" title="Control and K">Ctrl K</Kbd>);
  const key = screen.getByText('Ctrl K');
  expect(key).toBe(ref.current);
  expect(key.tagName).toBe('KBD');
  expect(key).toHaveClass('om-kbd', 'shortcut');
  expect(key).toHaveAttribute('lang', 'en');
  expect(key).toHaveAttribute('title', 'Control and K');

  const markup = renderToStaticMarkup(
    <PlatformLinks><PlatformLink platform="github" href="#source" aria-label="Source" /></PlatformLinks>,
  );
  expect(markup).toContain('class="om-platform-link"');
  expect(markup).toContain('href="#source"');
  expect(markup).toContain('aria-label="Source"');
});
