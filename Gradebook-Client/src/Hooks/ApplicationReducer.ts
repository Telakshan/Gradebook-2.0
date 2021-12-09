import { rememberTheme } from "./Store";

export const ApplicationReducer = (state: any, action: any) => {
  const { type } = action;

  switch (type) {
    case "toggleDarkMode":
      const newState = { ...state };
      newState.darkMode = !newState.darkMode;
      rememberTheme(newState.darkMode);
      return newState;

    default: {
      return state;
    }
  }
};
