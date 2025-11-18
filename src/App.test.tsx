import React from 'react';
import {render, screen} from '@testing-library/react';
import LandingPage from './pages/App';

test('renders learn react link', () => {
  render(<LandingPage />);
  const linkElement = screen.getByText(/TingME!/i);
  expect(linkElement).toBeInTheDocument();
});
