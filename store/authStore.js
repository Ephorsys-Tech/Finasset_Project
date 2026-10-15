'use client';

let listeners = [];
let state = {
  admin: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authStore = {
  getState() {
    return state;
  },

  setState(newState) {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  },

  setAdmin(admin) {
    this.setState({
      admin,
      isAuthenticated: Boolean(admin),
      isLoading: false,
    });
  },

  clearAdmin() {
    this.setState({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  subscribe(listener) {
    listeners.push(listener);
    listener(state);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export default authStore;
