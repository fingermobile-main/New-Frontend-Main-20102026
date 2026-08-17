import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
writable: true,
value: jest.fn().mockImplementation((query) => ({
matches: false,
media: query,
onchange: null,
addListener: jest.fn(), // deprecated,
removeListener: jest.fn(), // deprecated,
addEventListener: jest.fn(),
removeEventListener: jest.fn(),
dispatchEvent: jest.fn()
  }))
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
observe: jest.fn(),
unobserve: jest.fn(),
disconnect: jest.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
observe: jest.fn(),
unobserve: jest.fn(),
disconnect: jest.fn()
}));

// Add TextEncoder and TextDecoder polyfills
import { TextEncoder, TextDecoder } from "text-encoding";

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock window.getComputedStyle
window.getComputedStyle = jest.fn().mockImplementation(() => ({
getPropertyValue: jest.fn()
}));
