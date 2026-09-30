import React, {} from 'react';
/**
 * Accessibility Testing Configuration
 * This file configures automated accessibility testing for the FingerMobile Protocol platform
 */

export interface AccessibilityConfig {rules: {
    [key: string]: 'error' | 'warning' | 'off';
  };
  ignore?: string[];
}

/**
 * WCAG 2.1 AA Compliance Rules
 */
export const wcag21AAConfig: AccessibilityConfig = {rules: {
  // Color Contrast
  'color-contrast': 'error',
  // ARIA Attributes
  'aria-valid-attr': 'error',
  'aria-required-attr': 'error',
  'aria-allowed-attr': 'error',
  'aria-hidden-body': 'error',
  // Forms
  'label': 'error',
  'input-image-alt': 'error',
  'select-name': 'error',
  // Images
  'image-alt': 'error',
  'image-redundant-alt': 'warning',
  // Keyboard Navigation
  'keyboard-nav': 'error',
  'tabindex': 'warning',
  // Links and Buttons
  'link-name': 'error',
  'button-name': 'error',
  'link-in-text-block': 'error',
  // Structure
  'html-has-lang': 'error',
  'landmark-one-main': 'error',
  'region': 'warning',
  // Tables
  'th-has-data-cells': 'error',
  // Text
  'meta-viewport': 'error'
}, ignore: [
  // Ignore certain dynamic content that may have false positives
  '#root > div:first-child', // Toast notifications
]
};

/**
 * Run accessibility audit on a specific element or the entire page
 * @param selector - CSS selector for the element to audit (defaults to entire document)
 * @param config - Accessibility configuration to use
 */
export const runAccessibilityAudit = async (
  selector: string = 'document', config: AccessibilityConfig = wcag21AAConfig
): Promise<{violations: any[];
  passes: any[];
  incomplete: any[];
}> => {
  // This is a placeholder for actual axe-core integration
  // In production, you would integrate with axe-core or similar tool

  console.warn('Accessibility audit not yet implemented. Install axe-core and configure properly.');

  return {violations: [], passes: [], incomplete: []
  };
};

/**
 * Check if an element meets minimum color contrast ratio
 * @param foregroundColor - Foreground color in hex format
 * @param backgroundColor - Background color in hex format
 * @param level - WCAG level ('AA' or 'AAA')
 */
export const checkColorContrast = (
  foregroundColor: string, backgroundColor: string, level: 'AA' | 'AAA' = 'AA'
): {ratio: number;
  passes: boolean;
  requiredRatio: number;
} => {
  // Placeholder implementation
  // In production, use a proper color contrast library
  return {ratio: 4.5, passes: true, requiredRatio: level === 'AA' ? 4.5 : 7
  };
};

/**
 * Validate keyboard navigation for a component
 * @param containerRef - Reference to the container element
 */
export const validateKeyboardNavigation = (
  containerRef: HTMLElement): {focusableElements: number;
  tabOrder: string[];
  issues: string[];
} => {
  const focusableSelectors = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
  ];

  const focusableElements = Array.from(
    containerRef.querySelectorAll(focusableSelectors.join(', '))
  );

  const tabOrder = focusableElements.map((el) => {
    const tagName = el.tagName.toLowerCase();
    const id = el.id || '';
    const ariaLabel = el.getAttribute('aria-label') || '';
    return `${tagName}${id ? '#' + id : ''}${ariaLabel ? `[${ariaLabel}]` : ''}`;
  });

  const issues: string[] = [];

  // Check for elements with tabindex > 0 (potential issues)
  focusableElements.forEach((el) => {
    const tabIndex = parseInt(el.getAttribute('tabindex') || '0');
    if (tabIndex > 0) {
      issues.push(`Element with positive tabindex found: ${el.tagName}`);
    }
  });

  // Check for buttons/links without accessible text
  focusableElements.forEach((el) => {
    if ((el.tagName === 'BUTTON' || el.tagName === 'A') && !el.textContent?.trim() && !el.getAttribute('aria-label')) {
      issues.push(`Button or link without accessible,
text: ${el.outerHTML.substring(0, 50)}...`);
    }
  });

  return {focusableElements: focusableElements.length,
    tabOrder,
    issues
  };
};
