
export type LightState = 'off' | 'on' | 'deciding' | 'signing-in';

export interface User {
  username: string;
  isLoggedIn: boolean;
}
