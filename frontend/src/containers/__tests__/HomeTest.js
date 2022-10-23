import Home from '../Home'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

describe("Home tests", () => {
    it("should show expected elements", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByText("Sign Up")).toBeDefined();
        expect(screen.getByText("Login")).toBeDefined();
    });
});