// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Properly mock window.location
delete (window as any).location;
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    hostname: 'localhost',
    port: '3000',
    protocol: 'http:',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock fetch API
Object.defineProperty(window, 'fetch', {
  value: jest.fn(),
  writable: true,
});