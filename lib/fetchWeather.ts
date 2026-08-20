export async function fetchDistrictWeather(adm4Code: string) {
  try {
    const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4Code}`, {
      next: { revalidate: 3600 } // cache 1 jam
    });
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch Weather Error:', error);
    return null;
  }
}

export async function fetchMarineWeather() {
  try {
    const res = await fetch('https://peta-maritim.bmkg.go.id/public_api/perairan/G.06_Perairan%20Semarang%20-%20Demak.json', {
      next: { revalidate: 3600 } // cache 1 jam
    });
    if (!res.ok) throw new Error('Failed to fetch marine weather');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch Marine Error:', error);
    return null;
  }
}
