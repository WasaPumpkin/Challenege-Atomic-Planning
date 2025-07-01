// // src/utils/validators.ts

// Rule: No spaces allowed
export const validateNoSpaces = (name: string): true | string => 
  !/\s/.test(name) || "No se permiten espacios.";

// Rule: Length between 5 and 20 characters
export const validateLength = (name: string): true | string => 
  (name.length >= 5 && name.length <= 20) || "El nombre debe tener entre 5 y 20 caracteres.";

// Rule: No special characters (only letters and numbers)
export const validateSpecialChars = (name: string): true | string => 
  !/[^a-zA-Z0-9]/.test(name) || "No se permiten caracteres especiales.";

// Rule: Must not be composed of only numbers
export const validateNotOnlyNumbers = (name: string): true | string => 
  !/^\d+$/.test(name) || "El nombre no puede ser solo números.";

// Rule: No more than 3 numbers allowed in the name
export const validateMaxNumbers = (name:string): true | string => {
  const numbers = name.match(/\d/g) || [];
  return numbers.length <= 3 || "No se permiten más de 3 números.";
}

// Rule: Name must be unique (case-insensitive)
export const validateUniqueness = (name: string, existingNames: string[]): true | string => {
  const isTaken = existingNames
    .map(n => n.toLowerCase())
    .includes(name.toLowerCase());
  return !isTaken || "Ese nombre ya está en uso, elige otro.";
}


/**
 * Master validator that runs all checks for a name field.
 * @param name The name to validate.
 * @param existingNames An optional array of names to check for uniqueness.
 * @returns `null` if the name is valid, or the first error message string if it's invalid.
 */
export const validateName = (name: string, existingNames: string[] = []): string | null => {
  // If the field is empty, don't show an error yet.
  if (!name) return null;

  const validators = [
    validateLength,
    validateNoSpaces,
    validateSpecialChars,
    validateNotOnlyNumbers,
    validateMaxNumbers,
  ];

  for (const validator of validators) {
    const result = validator(name);
    if (typeof result === 'string') {
      return result; // Return the first error found
    }
  }

  // Uniqueness check is separate as it requires the second argument.
  if (existingNames.length > 0) {
    const uniquenessResult = validateUniqueness(name, existingNames);
    if (typeof uniquenessResult === 'string') {
      return uniquenessResult;
    }
  }

  return null; // All validations passed
};