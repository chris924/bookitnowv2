import { create } from "zustand";

type LoginDialog = "guest" | "provider" | null;

interface LoginDialogState {
  openDialog: LoginDialog;
  setOpenDialog: (dialog: LoginDialog) => void;
}

// The login dialogs live in the Navbar; this lets other parts of the page
// (e.g. the home page call-to-action) open them too.
export const useLoginDialogStore = create<LoginDialogState>((set) => ({
  openDialog: null,
  setOpenDialog: (openDialog) => set({ openDialog }),
}));
