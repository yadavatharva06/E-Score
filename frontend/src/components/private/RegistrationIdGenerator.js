export function RegistrationIdGenerator() {
  // 1. Get the current timestamp string (e.g., "1787834529123")
  const timestampStr = Date.now().toString();
  
  // 2. Take the last 7 digits of the timestamp (constantly changing every millisecond)
  const timeSlice = timestampStr.slice(-7); 

  // 3. Generate a 3-digit secure random number using your crypto code
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const max32Bit = 4294967295;
  const normalizedRandom = array[0] / max32Bit;
  const randomSlice = Math.floor(100 + normalizedRandom * 900).toString(); // Generates 100-999

  // 4. Combine them: 7 digits + 3 digits = 10 digits
  return `${timeSlice}${randomSlice}`;
}
