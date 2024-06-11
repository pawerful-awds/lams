export class Storage<T> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // Create or Update an item
  setItem(key: string, value: T): void {
    const currentData = this.getData();
    currentData[key] = value;
    this.setData(currentData);
  }

  // Read an item
  getItem(key: string): T | null {
    const currentData = this.getData();
    return currentData[key] || null;
  }

  // Read all items
  getAllItems(): Record<string, T> {
    return this.getData();
  }

  // Delete an item
  removeItem(key: string): void {
    const currentData = this.getData();
    delete currentData[key];
    this.setData(currentData);
  }

  // Clear all items
  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  private getData(): Record<string, T> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  private setData(data: Record<string, T>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
