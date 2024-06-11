export const fetchAnimationData = async (dataRefUrl: string): Promise<string> => {
  try {
    const response = await fetch(dataRefUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch animation data from URL: ${response.statusText}`);
    }
    const json = await response.json();
    return JSON.stringify(json);
  } catch (err) {
    return '';
  }
};
