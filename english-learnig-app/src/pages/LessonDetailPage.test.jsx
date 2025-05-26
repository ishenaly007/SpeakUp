import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LessonDetailPage from './LessonDetailPage';
import *  as lessonService from '../services/lessonService';
import * as AuthContext from '../contexts/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest'; // Import vi from vitest

// Mock useParams
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

// Mock lessonService
vi.mock('../services/lessonService');

// Mock AuthContext
vi.mock('../contexts/AuthContext');

const mockLessons = [
  { id: 1, title: 'First Lesson', description: 'Desc 1', content: 'Content 1' },
  { id: 2, title: 'Another Nice Lesson', description: 'Desc 2', content: 'Content 2' },
];

import { useParams } from 'react-router-dom'; // Import the mocked version

describe('LessonDetailPage', () => {
  beforeEach(() => { // No longer need async here
    // Reset mocks before each test
    AuthContext.useAuth.mockReturnValue({ user: { id: 1 } });
    lessonService.fetchLessons.mockResolvedValue(mockLessons);
    useParams.mockReset(); // Reset the mock itself
  });

  test('displays lesson details when a matching lesson is found', async () => {
    useParams.mockReturnValue({ lessonTitle: 'another-nice-lesson' });
    
    render(
      <MemoryRouter initialEntries={['/lessons/another-nice-lesson']}>
        <Routes>
          <Route path="/lessons/:lessonTitle" element={<LessonDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading lesson details.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /another nice lesson/i })).toBeInTheDocument();
    });
    expect(screen.getByText('Desc 2')).toBeInTheDocument();
  });

  test('displays "Lesson not found" when no lesson matches the slug', async () => {
    useParams.mockReturnValue({ lessonTitle: 'non-existent-lesson' });
    
    render(
      <MemoryRouter initialEntries={['/lessons/non-existent-lesson']}>
        <Routes>
          <Route path="/lessons/:lessonTitle" element={<LessonDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading lesson details.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/lesson not found/i)).toBeInTheDocument();
    });
  });

  test('displays error message when fetching lessons fails', async () => {
    lessonService.fetchLessons.mockRejectedValueOnce(new Error('Failed to fetch'));
    useParams.mockReturnValue({ lessonTitle: 'any-lesson' });

    render(
      <MemoryRouter initialEntries={['/lessons/any-lesson']}>
        <Routes>
          <Route path="/lessons/:lessonTitle" element={<LessonDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument();
    });
  });
});
