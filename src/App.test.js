import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Max Dyson and Anthony Half', () => {
  render(<App />);
  const nameElement = screen.getByText(/Max Dyson and Anthony Half/i);
  expect(nameElement).toBeInTheDocument();
});
