import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const labelElement = screen.getByText(/Enter email address/i);
  expect(labelElement).toBeInTheDocument();
});
