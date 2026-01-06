/**
 * Compares two semantic versions (X.Y.Z format)
 * @param version1 - First version to compare
 * @param version2 - Second version to compare
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
export function compareVersions(version1: string, version2: string): number {
  const parts1 = version1.split('.').map(Number)
  const parts2 = version2.split('.').map(Number)

  // Ensure both versions have 3 parts (major.minor.patch)
  while (parts1.length < 3) parts1.push(0)
  while (parts2.length < 3) parts2.push(0)

  for (let i = 0; i < 3; i++) {
    if (parts1[i] < parts2[i]) return -1
    if (parts1[i] > parts2[i]) return 1
  }

  return 0
}

/**
 * Checks if version1 is greater than version2
 */
export function isVersionGreater(version1: string, version2: string): boolean {
  return compareVersions(version1, version2) > 0
}

/**
 * Checks if version1 is greater than or equal to version2
 */
export function isVersionGreaterOrEqual(
  version1: string,
  version2: string
): boolean {
  return compareVersions(version1, version2) >= 0
}
