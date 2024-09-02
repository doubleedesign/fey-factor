import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditionCard from './EditionCard';

describe('<EditionCard />', () => {
  test('it should mount', () => {
    render(<EditionCard />);

    const EditionCard = screen.getByTestId('EditionCard');

    expect(EditionCard).toBeInTheDocument();
  });
});