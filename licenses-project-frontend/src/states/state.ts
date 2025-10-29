import { jwtDecode } from 'jwt-decode';
import { DynamicPermissionDTO } from '@/types/dtos';
import { GSResponseToken } from '@/types/api/responses';

interface StateStorage {
  Token: string;
  Refresh_Token: string;
  refreshTokenExpiryTime: string;
  Email: string;
  ClienteId: string;
  p: string; // permissions
}

class State {
  private static instance: State;

  // Core properties
  public Token = '';
  public Refresh_Token = '';
  public refreshTokenExpiryTime = '';
  public Email = '';
  public readonly ApiKey: string = import.meta.env.VITE_API_KEY ?? '';
  public readonly URL: string = import.meta.env.VITE_URL ?? '';

  // User properties
  public Nome = '';
  public UserId = '';
  public ClienteId = '';
  public RoleId = '';
  public Permissoes: DynamicPermissionDTO = {};

  public isLoaded = false;

  // Implement Singleton pattern
  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Helper function to get items from localStorage with type safety
  private getFromLocalStorage<T extends keyof StateStorage>(
    key: T,
    defaultValue = ''
  ): string {
    try {
      const value = localStorage.getItem(key);
      return value ?? defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  // Helper function to set items to localStorage with type safety
  private setToLocalStorage<T extends keyof StateStorage>(
    key: T,
    value: string
  ): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  // Helper function to remove items from localStorage with type safety
  private removeFromLocalStorage<T extends keyof StateStorage>(key: T): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // Decodes the JWT and sets the relevant state properties
  public decodeJwt(): void {
    if (!this.Token) {
      console.warn('No token available to decode');
      return;
    }

    try {
      const decodedToken: GSResponseToken = jwtDecode<GSResponseToken>(
        this.Token
      );
      this.Nome = decodedToken.name;
      this.UserId = decodedToken.uid;
      this.RoleId = decodedToken.roles.toLowerCase();
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      this.clearUserData();
    }
  }

  // Loads state from localStorage
  public load(): void {
    try {
      this.Token = this.getFromLocalStorage('Token');
      this.Refresh_Token = this.getFromLocalStorage('Refresh_Token');
      this.refreshTokenExpiryTime = this.getFromLocalStorage(
        'refreshTokenExpiryTime'
      );
      this.Email = this.getFromLocalStorage('Email');
      this.ClienteId = this.getFromLocalStorage('ClienteId');

      const permissionsStr = this.getFromLocalStorage('p');
      this.Permissoes = permissionsStr ? JSON.parse(permissionsStr) : {};

      if (this.Token) {
        this.decodeJwt();
      }

      this.isLoaded = true;
      console.log('State loaded successfully');
    } catch (error) {
      console.error('Error loading state:', error);
      this.clear();
    }
  }

  // Saves the current state to localStorage
  public save(): void {
    try {
      this.setToLocalStorage('Token', this.Token);
      this.setToLocalStorage('Refresh_Token', this.Refresh_Token);
      this.setToLocalStorage(
        'refreshTokenExpiryTime',
        this.refreshTokenExpiryTime
      );
      this.setToLocalStorage('Email', this.Email);
      this.setToLocalStorage('ClienteId', this.ClienteId);
      this.setToLocalStorage('p', JSON.stringify(this.Permissoes));

      console.log('State saved successfully');
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Clear user-specific data
  private clearUserData(): void {
    this.Nome = '';
    this.UserId = '';
    this.RoleId = '';
    this.Permissoes = {};
  }

  // Clears all state and localStorage
  public clear(): void {
    // Clear state properties
    this.Token = '';
    this.Refresh_Token = '';
    this.refreshTokenExpiryTime = '';
    this.Email = '';
    this.ClienteId = '';
    this.clearUserData();

    // Clear localStorage
    this.removeFromLocalStorage('Token');
    this.removeFromLocalStorage('Refresh_Token');
    this.removeFromLocalStorage('refreshTokenExpiryTime');
    this.removeFromLocalStorage('Email');
    this.removeFromLocalStorage('ClienteId');
    this.removeFromLocalStorage('p');

    console.log('State and localStorage cleared');
  }

  // Public method to get token from localStorage
  public getStoredToken(): string {
    return this.getFromLocalStorage('Token');
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return Boolean(this.Token && this.UserId);
  }
}

// Export singleton instance
export default State.getInstance();
