import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditionMenu from './EditionMenu';

describe('<EditionMenu />', () => {
  test('it should mount', () => {
    render(<EditionMenu />);

    const EditionMenu = screen.getByTestId('EditionMenu');

    expect(EditionMenu).toBeInTheDocument();
  });
});