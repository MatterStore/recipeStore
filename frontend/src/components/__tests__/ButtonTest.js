import Button from '../Button'
import { render } from '@testing-library/react'

describe("Button tests", () => {
    it ("should accept additional styles", () => {
        const { screen } = render(
            <Button
                className="custom-class"
            />
        );
        screen.classList.contains("custom-class")
    });
});