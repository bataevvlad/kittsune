// Suppress specific warnings during tests
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg) => {
    // Suppress useNativeDriver and removeListeners warnings
    if (
      typeof msg === 'string' &&
      (msg.includes('useNativeDriver') || msg.includes('removeListeners'))
    ) {
      return;
    }
  });

  jest.spyOn(console, 'error').mockImplementation((msg) => {
    // Suppress act() warnings in some cases
    if (typeof msg === 'string' && msg.includes('act(...)')) {
      return;
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
