import { authHandlers } from "./authHandlers";
import { serviceHandlers } from "./serviceHandlers";
import { appointmentHandlers } from "./appointmentHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [
  ...authHandlers,
  ...serviceHandlers,
  ...appointmentHandlers,
  ...userHandlers,
];
