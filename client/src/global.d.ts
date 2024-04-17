declare namespace google.accounts {
  const id: {
    initialize: (options: { client_id: string; callback: () => void }) => void;
    renderButton: (
      element: HTMLElement | null,
      options: { theme: string; size: string; text: string }
    ) => void;
  };
}