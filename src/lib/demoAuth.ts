export type DemoUser = {
  firstName: string;
  fullName?: string;
  phone?: string;
};

const STORAGE_KEY = "alfanar_demo_user";
const EVENT_NAME = "alfanar-demo-auth";

export function getDemoUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function setDemoUser(user: DemoUser) {
  // TODO(auth): replace demo storage with real auth session/token from API.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function clearDemoUser() {
  // TODO(auth): call logout endpoint and clear real session/token.
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeDemoAuth(onChange: () => void) {
  const handle = () => onChange();
  window.addEventListener(EVENT_NAME, handle);
  window.addEventListener("storage", handle);
  return () => {
    window.removeEventListener(EVENT_NAME, handle);
    window.removeEventListener("storage", handle);
  };
}

