import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LessonDetailPage from './LessonDetailPage';
import { fetchLesson } from '../services/lessonService';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Mocking external dependencies
jest.mock('../services/lessonService');
jest.mock('../contexts/AuthContext');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // import and retain default behavior
    useParams: jest.fn(),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('LessonDetailPage JavaScript Handling', () => {
    let mockDocumentCreateElement;
    let mockLessonHtmlRenderArea;
    let mockAppendChild;

    beforeEach(() => {
        // Setup mock implementations for hooks
        useAuth.mockReturnValue({ user: { id: '123', name: 'Test User' } });
        useParams.mockReturnValue({ title: 'test-lesson' });
        useLocation.mockReturnValue({ state: { lessonId: '1' } });
        useNavigate.mockReturnValue(jest.fn());

        // Spy on document.createElement
        mockDocumentCreateElement = jest.spyOn(document, 'createElement');

        // Mock the target div for script appending
        mockAppendChild = jest.fn();
        mockLessonHtmlRenderArea = {
            appendChild: mockAppendChild,
            // Add other properties if the component interacts with them
        };
        // Mock querySelector to return our mock div when the specific ID is queried
        // This is crucial as the component looks for '#lesson-html-render-area' *after* initial render
        // For this specific test, we'll refine this to spy on the div that actually gets the script.
        // The component uses: document.querySelector(`.${styles.lessonContent} > div`)
        // We will mock querySelector for this specific selector if needed, or ensure #lesson-html-render-area is found.
        // For simplicity, let's assume #lesson-html-render-area is directly queryable.
        jest.spyOn(document, 'getElementById').mockImplementation(id => {
            if (id === 'lesson-html-render-area') {
                return mockLessonHtmlRenderArea;
            }
            if (id === 'lesson-dynamic-script') { // For cleanup
                return null; // Initially, no script exists with this ID
            }
            return null;
        });
        
        // Spy on document.body.appendChild as a fallback if the specific div isn't found
        // (though the component's logic tries a specific div first)
        // We'll focus on the specific div for now.
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks after each test
    });

    test('should attempt to create and append script when javascriptContent exists', async () => {
        const sampleJsContent = "console.log('hello lesson');";
        const mockLessonData = {
            id: '1',
            title: 'Test Lesson with JS',
            level: 'Beginner',
            description: 'This lesson has JavaScript.',
            htmlContent: '<p>Lesson HTML content here.</p>',
            cssContent: '.test-class { color: blue; }',
            javascriptContent: sampleJsContent,
            tests: [],
            completed: false,
        };
        fetchLesson.mockResolvedValue(mockLessonData);
        
        // Mock querySelector for the specific div where script is appended
        // The component uses: document.querySelector(`.${styles.lessonContent} > div`)
        // This is tricky due to CSS modules. We added `id="lesson-html-render-area"` to the div.
        // So getElementById should work if the component structure is as expected.

        render(<LessonDetailPage />);

        await waitFor(() => {
            expect(fetchLesson).toHaveBeenCalledWith('1', '123');
        });

        // Verify script creation
        expect(mockDocumentCreateElement).toHaveBeenCalledWith('script');
        
        // Get the script element instance created by the component
        const scriptElementInstance = mockDocumentCreateElement.mock.results[0].value;
        expect(scriptElementInstance.id).toBe('lesson-dynamic-script');
        expect(scriptElementInstance.type).toBe('text/javascript');
        expect(scriptElementInstance.textContent).toBe(sampleJsContent);

        // Verify appending to the mocked #lesson-html-render-area div
        expect(mockAppendChild).toHaveBeenCalledWith(scriptElementInstance);

    });

    test('should not attempt to create script when javascriptContent is missing or empty', async () => {
        const mockLessonDataWithoutJs = {
            id: '2',
            title: 'Test Lesson without JS',
            level: 'Intermediate',
            description: 'This lesson does not have JavaScript.',
            htmlContent: '<p>Other lesson HTML.</p>',
            cssContent: '.other-class { color: green; }',
            javascriptContent: null, // or undefined, or ""
            tests: [],
            completed: false,
        };
        fetchLesson.mockResolvedValue(mockLessonDataWithoutJs);

        render(<LessonDetailPage />);

        await waitFor(() => {
            expect(fetchLesson).toHaveBeenCalledWith('1', '123'); // Still '1' due to beforeEach mock, can override if needed
        });
        
        // Verify script creation was NOT called for a script tag
        // Check if createElement was called, but not for 'script' if other elements are created
        const scriptCreationCall = mockDocumentCreateElement.mock.calls.find(call => call[0] === 'script');
        expect(scriptCreationCall).toBeUndefined();

        // Verify appendChild was NOT called on our mock target
        expect(mockAppendChild).not.toHaveBeenCalled();
    });
    
    test('should remove existing script on cleanup or re-render', async () => {
        const sampleJsContent1 = "console.log('first script');";
        const mockLessonData1 = {
            id: '1', title: 'Lesson 1', htmlContent: '<p>Content 1</p>', javascriptContent: sampleJsContent1, tests: []
        };
        fetchLesson.mockResolvedValueOnce(mockLessonData1);

        const mockScriptElement = {
            id: 'lesson-dynamic-script',
            remove: jest.fn(),
            // parentNode: document.body // or any mock parent
        };
        
        // First render
        const { rerender } = render(<LessonDetailPage />);
        
        // Mock getElementById to return the mock script for cleanup phase
        document.getElementById.mockImplementation(id => {
            if (id === 'lesson-dynamic-script') return mockScriptElement;
            if (id === 'lesson-html-render-area') return mockLessonHtmlRenderArea;
            return null;
        });


        await waitFor(() => {
            expect(mockAppendChild).toHaveBeenCalledTimes(1); // Appended first script
        });

        // Prepare for second render with different lesson data (triggering useEffect cleanup)
        const sampleJsContent2 = "console.log('second script');";
        const mockLessonData2 = {
            id: '2', title: 'Lesson 2', htmlContent: '<p>Content 2</p>', javascriptContent: sampleJsContent2, tests: []
        };
        // Reset appendChild mock for the second call, but keep the remove spy on the *original* mockScriptElement
        mockAppendChild.mockClear(); 
        fetchLesson.mockResolvedValueOnce(mockLessonData2);
        
        // Update useLocation to change lessonId, triggering a re-fetch and re-run of effects
        useLocation.mockReturnValue({ state: { lessonId: '2' } });


        rerender(<LessonDetailPage />);

        await waitFor(() => {
            expect(mockScriptElement.remove).toHaveBeenCalledTimes(1); // Previous script should be removed
        });
        await waitFor(() => {
             // A new script should be created and appended for the new lesson content
            expect(mockDocumentCreateElement).toHaveBeenCalledWith('script'); // Called again for the second script
            expect(mockAppendChild).toHaveBeenCalledTimes(1); // Appended second script
            const newScriptInstance = mockAppendChild.mock.calls[0][0];
            expect(newScriptInstance.textContent).toBe(sampleJsContent2);
        });
    });
});
