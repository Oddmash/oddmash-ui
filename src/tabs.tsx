import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Tabs = TabsPrimitive.Root;
export const TabsList = /* @__PURE__ */ forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({ className, ...props }, ref) => <TabsPrimitive.List {...props} ref={ref} className={cx('om-tabs-list', className)} />);
TabsList.displayName = 'TabsList';
export const TabsTrigger = /* @__PURE__ */ forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => <TabsPrimitive.Trigger {...props} ref={ref} className={cx('om-tabs-trigger', className)} />);
TabsTrigger.displayName = 'TabsTrigger';
export const TabsContent = /* @__PURE__ */ forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(({ className, ...props }, ref) => <TabsPrimitive.Content {...props} ref={ref} className={cx('om-tabs-content', className)} />);
TabsContent.displayName = 'TabsContent';
