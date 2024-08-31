import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageWrapper from './PageWrapper';

describe('<PageWrapper />', () => {
  test('it should mount', () => {
    render(<PageWrapper />);

    const PageWrapper = screen.getByTestId('PageWrapper');

    expect(PageWrapper).toBeInTheDocument();
  });
});