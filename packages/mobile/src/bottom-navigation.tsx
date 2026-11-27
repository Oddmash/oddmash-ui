'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type BottomNavigationItem = Omit<ComponentPropsWithoutRef<'a'>, 'aria-current' | 'children' | 'href'> & {
  id: string;
  href: string;
  label: string;
  icon?: ReactNode;
};

export type BottomNavigationProps = {
  label: string;
  items: readonly BottomNavigationItem[];
  activeId?: string;
  className?: string;
};

export const BottomNavigation = ({ label, items, activeId, className }: BottomNavigationProps) => (
  <nav aria-label={label} className={className ? `om-bottom-nav ${className}` : 'om-bottom-nav'}>
    <ul>
      {items.map(({ id, label: itemLabel, icon, ...link }) => (
        <li key={id}>
          <a {...link} aria-current={id === activeId ? 'page' : undefined}>
            {icon && <span className="om-bottom-nav-icon" aria-hidden="true">{icon}</span>}
            <span>{itemLabel}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
