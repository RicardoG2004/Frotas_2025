/**
 * URL Selector Utility
 *
 * Automatically selects the correct API URL based on the current page protocol (HTTP/HTTPS).
 * Supports separate environment variables for HTTP and HTTPS endpoints.
 *
 * Environment Variable Pattern:
 * - VITE_URL_HTTP = "http://api.example.com:8084"
 * - VITE_URL_HTTPS = "https://api.example.com:8094"
 *
 * Or use a single variable (backward compatibility):
 * - VITE_URL = "http://api.example.com" (will be used for both)
 */

/**
 * Gets the current page protocol
 *
 * @returns The current protocol (http: or https:)
 */
export function getCurrentProtocol(): string {
  if (typeof window === 'undefined') {
    // Fallback for SSR or non-browser environments
    return 'https:'
  }
  return window.location.protocol
}

/**
 * Selects the appropriate URL based on the current page protocol
 *
 * Supports two patterns:
 * 1. Separate HTTP/HTTPS URLs: Uses VITE_URL_HTTP and VITE_URL_HTTPS
 * 2. Single URL (backward compatibility): Uses VITE_URL for both
 *
 * @param httpUrl - URL for HTTP environment (from VITE_URL_HTTP or VITE_URL)
 * @param httpsUrl - URL for HTTPS environment (from VITE_URL_HTTPS or VITE_URL)
 * @returns The appropriate URL based on current protocol
 */
export function selectUrlByProtocol(
  httpUrl: string,
  httpsUrl?: string
): string {
  const currentProtocol = getCurrentProtocol()
  const isHttps = currentProtocol === 'https:'

  // If HTTPS URL is provided and we're on HTTPS, use it
  if (isHttps && httpsUrl) {
    return httpsUrl
  }

  // Otherwise use HTTP URL (or fallback to httpsUrl if httpUrl is empty)
  return httpUrl || httpsUrl || ''
}

/**
 * Gets the appropriate API URL from environment variables
 *
 * Checks for protocol-specific environment variables first, then falls back to generic ones.
 *
 * @param baseName - Base name for the environment variable (e.g., 'VITE_URL')
 * @returns The appropriate URL based on current protocol
 */
export function getApiUrl(baseName: string): string {
  const httpUrl =
    import.meta.env[`${baseName}_HTTP`] || import.meta.env[baseName] || ''
  const httpsUrl =
    import.meta.env[`${baseName}_HTTPS`] || import.meta.env[baseName] || ''

  return selectUrlByProtocol(httpUrl, httpsUrl)
}
