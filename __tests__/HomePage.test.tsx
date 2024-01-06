import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { useSession } from "next-auth/react";
import '@testing-library/jest-dom';


// Mock the `useSession` hook
jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  useSession: jest.fn(),
}));

test('renders blank screen with a status of loading', () => {
  (useSession as jest.Mock).mockReturnValue({ status: 'loading', data: null });

  render(<Home />);
  expect(screen.queryByText(' ')).not.toBeInTheDocument();
});
