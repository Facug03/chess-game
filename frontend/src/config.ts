export const config = {
  PROD: import.meta.env.MODE === 'production',
  BACK_URL: import.meta.env.VITE_BACK_URL,
}
