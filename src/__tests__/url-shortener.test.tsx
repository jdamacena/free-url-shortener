import React from 'react';
import { render, screen } from '@testing-library/react';
import UrlShortener from '../components/UrlShortener';

describe('UrlShortener component', () => {
  it('renders input and button', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<UrlShortener urlInputRef={ref} />);
    expect(screen.getByPlaceholderText(/Type or paste your URL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten url/i })).toBeInTheDocument();
  });
});
