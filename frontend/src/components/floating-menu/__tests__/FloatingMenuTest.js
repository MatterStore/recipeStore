import FloatingMenu from '../FloatingMenu';
import { render, screen } from '@testing-library/react';

describe('FloatingMenu tests', () => {
  it('should show child elements', () => {
    render(<FloatingMenu>Child Element</FloatingMenu>);
    expect(screen.getByText('Child Element')).toBeDefined();
  });
});
