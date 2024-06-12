export function validateLottieJSONFile(
  file: File
): Promise<{ isValid: boolean; data?: { [x: string]: TODO } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        console.log("# jsonData", jsonData);
        const { v, nm, layers, markers } = jsonData;
        // File contains all required fields
        if (v && nm && layers && markers) {
          resolve({ isValid: true, data: jsonData });
        } else {
          // File is missing one or more required fields
          resolve({ isValid: false });
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
