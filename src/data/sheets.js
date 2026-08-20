const API_URL =
  "https://script.google.com/macros/s/AKfycbydT2Ddqv8-Vv9bKqYkQizvkii7ttJ3TRFIpT5m-nlco5fQU3lkEQrGDUP2-69LsW8NAQ/exec";

export async function fetchSheet(sheetName) {
  const res = await fetch(
    `${API_URL}?sheet=${encodeURIComponent(sheetName)}`
  );

  if (!res.ok) {
    throw new Error(
      `No se pudo cargar la hoja "${sheetName}".`
    );
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}