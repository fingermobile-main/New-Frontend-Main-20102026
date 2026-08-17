import React, {} from 'react';
/**
 * Accessibility Utilities for Keyboard Navigation and Focus Management
 */

/**
 * Traps focus within a container element
 * @param containerRef - Reference to the container element
 */
export const trapFocus = (
  containerRef: React.RefObject<HTMLElement>) => {
  const handleKeyDown = (
  e: KeyboardEvent) => {
    if (!containerRef.current || e.key !== 'Tab') return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      // Shift + Tab: Move backward
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: Move forward
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};

/**
 * Restores focus to a previously focused element
 * @param previousFocus - The element that had focus before
 */
export const restoreFocus = (
  previousFocus: HTMLElement | null) => {
  if (previousFocus && typeof previousFocus.focus === 'function') {
    previousFocus.focus();
  }
};

/**
 * Sets focus to the first focusable element in a container
 * @param containerRef - Reference to the container element
 */
export const focusFirstElement = (
  containerRef: React.RefObject<HTMLElement>) => {
  if (!containerRef.current) return;

  const focusableElements = containerRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

/**
 * Checks if an element is visible (for keyboard navigation)
 * @param element - The element to check
 */
export const isVisible = (
  element: HTMLElement): boolean => {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
};

/**
 * Gets all focusable elements within a container
 * @param container - The container element
 */
export const getFocusableElements = (
  container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details',
    'summary'
  ];

  return Array.from(
    container.querySelectorAll(focusableSelectors.join(', '))
  ) as HTMLElement[];
};

/**
 * Announces a message to screen readers
 * @param message - The message to announce
 * @param priority - Priority level ('polite' or 'assertive')
 */
export const announceToScreenReader = (
  message: string,
priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
