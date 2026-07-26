export interface SavedAccount {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
  token: string;
  refreshToken?: string;
  lastActive: number;
}

const STORAGE_KEY = "kids_oasis_saved_accounts";

export function getSavedAccounts(): SavedAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read saved accounts:", err);
    return [];
  }
}

export function saveAccount(user: SavedAccount["user"], token: string, refreshToken?: string) {
  if (typeof window === "undefined" || !user || !user.email) return;
  const accounts = getSavedAccounts();
  const existingIdx = accounts.findIndex((acc) => acc.user.email.toLowerCase() === user.email.toLowerCase());

  const newAccount: SavedAccount = {
    user,
    token,
    refreshToken,
    lastActive: Date.now(),
  };

  if (existingIdx >= 0) {
    accounts[existingIdx] = newAccount;
  } else {
    accounts.push(newAccount);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error("Failed to save account session:", err);
  }
}

export function removeAccount(email: string) {
  if (typeof window === "undefined") return;
  const accounts = getSavedAccounts().filter((acc) => acc.user.email.toLowerCase() !== email.toLowerCase());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error("Failed to remove saved account:", err);
  }
}
