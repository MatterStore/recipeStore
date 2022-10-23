import Button from '../Button'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';

describe("Button tests", () => {
    it ("should accept additional styles", () => {
        render(
            <MemoryRouter>
                <Button
                    className="custom-class"
                    to="test"
                >
                    Test Button
                </Button>
            </MemoryRouter>
        );
        screen.getByText("Test Button").classList.contains("custom-class")
    });

    it ("should call click handler", () => {
        const callback = jest.fn()
        render(
            <MemoryRouter>
                <Button
                    className="custom-class"
                    to="test"
                    onClick={callback}
                >
                    Test Button
                </Button>
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("Test Button"));
        expect(callback.mock.calls.length).toBe(1);
    });
});