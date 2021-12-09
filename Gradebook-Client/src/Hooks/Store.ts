const Storage = (theme: boolean) => {
  localStorage.setItem("darkMode", JSON.stringify(theme));
};

export const rememberTheme = (theme: boolean) => {
  Storage(theme);
  return { theme };
};
