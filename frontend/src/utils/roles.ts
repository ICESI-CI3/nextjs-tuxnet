export const hasRole = (roles: string[], required: string | string[]) => {
  if (Array.isArray(required)) {
    return required.some((r) => roles.includes(r));
  }
  return roles.includes(required);
};
