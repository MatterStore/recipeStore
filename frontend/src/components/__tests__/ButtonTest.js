import Button from '../Button'
import { render, screen } from '@testing-library/react'
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
});