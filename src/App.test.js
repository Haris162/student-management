/**
 * Basic test suite for App component
 * 
 * This test verifies that the App component renders without crashing
 * Can be extended with additional tests for component behavior
 */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
