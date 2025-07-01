// src/utils/validators.test.ts
import {
  validateLength,
  validateNoSpaces,
  validateSpecialChars,
  validateNotOnlyNumbers,
  validateMaxNumbers,
  validateUniqueness,
  validateName,
} from './validators'; // Asegúrate de que la ruta sea correcta

/**
 * Suite de pruebas para los validadores de nombres de usuario.
 * Cada función individual se prueba en su propio bloque `describe` para una mejor organización.
 */
describe('Validadores de Nombres', () => {
  describe('validateLength', () => {
    it('debería devolver true para un nombre con una longitud válida', () => {
      expect(validateLength('Andrey12')).toBe(true);
    });

    it('debería devolver un mensaje de error si el nombre es demasiado corto', () => {
      const mensajeError = 'El nombre debe tener entre 5 y 20 caracteres.';
      expect(validateLength('abc')).toBe(mensajeError);
    });

    it('debería devolver un mensaje de error si el nombre es demasiado largo', () => {
      const mensajeError = 'El nombre debe tener entre 5 y 20 caracteres.';
      expect(validateLength('EsteNombreEsDemasiadoLargoParaValidar')).toBe(
        mensajeError
      );
    });

    it('debería devolver un mensaje de error para un string vacío', () => {
      const mensajeError = 'El nombre debe tener entre 5 y 20 caracteres.';
      expect(validateLength('')).toBe(mensajeError);
    });
  });

  describe('validateNoSpaces', () => {
    it('debería devolver true si el nombre no contiene espacios', () => {
      expect(validateNoSpaces('SinEspacios')).toBe(true);
    });

    it('debería devolver un mensaje de error si el nombre contiene espacios', () => {
      expect(validateNoSpaces('Con espacio')).toBe('No se permiten espacios.');
    });

    it('debería devolver un mensaje de error si el nombre tiene espacios al inicio o al final', () => {
      expect(validateNoSpaces(' conEspacio')).toBe('No se permiten espacios.');
      expect(validateNoSpaces('conEspacio ')).toBe('No se permiten espacios.');
    });
  });

  describe('validateSpecialChars', () => {
    it('debería devolver true si no hay caracteres especiales', () => {
      expect(validateSpecialChars('Normal123')).toBe(true);
    });

    it('debería devolver un mensaje de error si contiene caracteres especiales', () => {
      expect(validateSpecialChars('Inválido@!')).toBe(
        'No se permiten caracteres especiales.'
      );
    });
  });

  describe('validateNotOnlyNumbers', () => {
    it('debería devolver true si el nombre no se compone únicamente de números', () => {
      expect(validateNotOnlyNumbers('Andrey95')).toBe(true);
    });

    it('debería devolver un mensaje de error si el nombre solo contiene números', () => {
      expect(validateNotOnlyNumbers('123456')).toBe(
        'El nombre no puede ser solo números.'
      );
    });
  });

  describe('validateMaxNumbers', () => {
    it('debería devolver true si el nombre tiene 3 números o menos', () => {
      expect(validateMaxNumbers('Usuario123')).toBe(true);
      expect(validateMaxNumbers('Usuario12')).toBe(true);
      expect(validateMaxNumbers('Usuario')).toBe(true);
    });

    it('debería devolver un mensaje de error si el nombre tiene más de 3 números', () => {
      expect(validateMaxNumbers('Usuario1234')).toBe(
        'No se permiten más de 3 números.'
      );
      expect(validateMaxNumbers('U1sua2rio345')).toBe(
        'No se permiten más de 3 números.'
      );
    });
  });

  describe('validateUniqueness', () => {
    const nombresExistentes = ['Carlos', 'Juan', 'Ana'];

    it('debería devolver true si el nombre es único', () => {
      expect(validateUniqueness('Pedro', nombresExistentes)).toBe(true);
    });

    it('debería devolver un mensaje de error si el nombre ya existe (insensible a mayúsculas)', () => {
      const mensajeError = 'Ese nombre ya está en uso, elige otro.';
      expect(validateUniqueness('carlos', nombresExistentes)).toBe(
        mensajeError
      );
      expect(validateUniqueness('JUAN', nombresExistentes)).toBe(mensajeError);
    });
  });

  // Pruebas para la función principal que orquesta todas las validaciones
  describe('validateName (Función de Orquestación)', () => {
    const listaDeNombres = ['Andrey', 'Maria'];

    it('debería devolver null si el nombre pasa todas las validaciones', () => {
      expect(validateName('Valido95', listaDeNombres)).toBe(null);
    });

    it('debería devolver únicamente el primer mensaje de error que encuentre', () => {
      // Este nombre tiene longitud incorrecta y un espacio. Debería devolver el error de longitud.
      const nombreInvalido = 'a b';
      expect(validateName(nombreInvalido, listaDeNombres)).toBe(
        'El nombre debe tener entre 5 y 20 caracteres.'
      );
    });

    it('debería devolver el error de espacios si la longitud es correcta pero hay espacios', () => {
      const nombreConEspacio = 'nombre con espacio';
      expect(validateName(nombreConEspacio, listaDeNombres)).toBe(
        'No se permiten espacios.'
      );
    });

    it('debería devolver el error de unicidad si todas las demás validaciones pasan', () => {
      expect(validateName('Andrey', listaDeNombres)).toBe(
        'Ese nombre ya está en uso, elige otro.'
      );
    });
  });
});
