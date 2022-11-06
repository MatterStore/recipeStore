import FloatingMenuParent from '../FloatingMenuParent';
import { fireEvent, render, screen } from '@testing-library/react';

describe('FloatingMenuParent tests', () => {
  it('should toggle child elements when clicked', () => {
    render(
      <div>
        <FloatingMenuParent label="Parent">Child Element</FloatingMenuParent>
      </div>
    );
    expect(screen.queryByText('Child Element')).toBeNull();
    fireEvent.focus(screen.getByText('Parent'));
    expect(screen.getByText('Child Element')).toBeDefined();
    fireEvent.focusOut(screen.getByText('Parent'));
    expect(screen.queryByText('Child Element')).toBeNull();
  });
});
