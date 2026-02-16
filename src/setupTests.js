/**
 * Jest Testing Setup
 * 
 * Configures the testing environment with jest-dom custom matchers
 * This allows for more expressive DOM assertions in tests, such as:
 * - expect(element).toHaveTextContent(/react/i)
 * - expect(element).toBeInTheDocument()
 * - expect(element).toBeVisible()
 * 
 * Learn more: https://github.com/testing-library/jest-dom
 */

import '@testing-library/jest-dom';
