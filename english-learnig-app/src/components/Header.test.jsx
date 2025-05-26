// Example for Header.test.jsx (using Vitest syntax)
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { AuthContext } from '../contexts/AuthContext'; // Adjust path if needed

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../contexts/AuthContext', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useAuth: () => mockUseAuth(),
  };
});

describe('Header Component', () => {
  it('renders navigation links and logout button when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, username: 'TestUser' },
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('Уроки')).toBeInTheDocument();
    expect(screen.getByText('Чат с ИИ')).toBeInTheDocument();
    expect(screen.getByText('Пройти Квизы')).toBeInTheDocument();
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });

  it('does not render navigation links or logout button when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: vi.fn(),
    });
    
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.queryByText('Уроки')).not.toBeInTheDocument();
    // Added checks for other links as per the first test's pattern
    expect(screen.queryByText('Чат с ИИ')).not.toBeInTheDocument();
    expect(screen.queryByText('Пройти Квизы')).not.toBeInTheDocument();
    expect(screen.queryByText('Профиль')).not.toBeInTheDocument();
    expect(screen.queryByText('Выйти')).not.toBeInTheDocument();
  });
});
