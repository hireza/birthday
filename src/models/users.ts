export interface User {
  id: number;
  email: string;
  full_name: string;
  birthday: string; // ISO 8601 format (YYYY-MM-DD)
  timezone: string; // Timezone
}
