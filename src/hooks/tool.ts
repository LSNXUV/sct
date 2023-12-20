import { useEffect } from "react";

export const useKeyWithThing = (keyCombination: string, callback: (e: KeyboardEvent) => void) => {
    useEffect(() => {
      const onKeySwitchTheme = (event: KeyboardEvent) => {
        const isPressed = keyCombination.split('+').every(key => 
            key === 'Ctrl' ? event.ctrlKey :
            key === 'Alt' ? event.altKey :
            key === 'Shift' ? event.shiftKey :
            event.key === key || event.key === key.toLowerCase() || event.key === key.toUpperCase()
          );
        if (isPressed) {
          callback(event);
        }
        }
        window.addEventListener('keydown', onKeySwitchTheme);
        return () => {
          window.removeEventListener('keydown', onKeySwitchTheme);
        };
    }, [keyCombination, callback]);
};