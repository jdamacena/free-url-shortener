import React from 'react';
import { render, screen } from '@testing-library/react';
import UrlShortener from '../components/UrlShortener';

if (typeof window === 'undefined') {
  // Polyfill window, document, navigator, and text encoders for environments without jsdom (e.g., Bun test runner)
  // @ts-ignore
  const { TextEncoder, TextDecoder } = require('util');
  // @ts-ignore
  global.TextEncoder = TextEncoder;
  // @ts-ignore
  global.TextDecoder = TextDecoder;
  // @ts-ignore
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  // @ts-ignore
  global.window = dom.window;
  // @ts-ignore
  global.document = dom.window.document;
  // @ts-ignore
  global.navigator = dom.window.navigator;
}

describe('UrlShortener component', () => {
  it('renders input and button', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<UrlShortener urlInputRef={ref} />);
    expect(screen.getByPlaceholderText(/Type or paste your URL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten url/i })).toBeInTheDocument();
  });
});
