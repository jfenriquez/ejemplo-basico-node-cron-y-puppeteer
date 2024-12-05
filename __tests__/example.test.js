
/////ejemplo de test

import { describe, it, expect } from "vitest";

import { sumar } from "../index";

describe("sumar", () => {
  // adding two positive integers
  it("should return the sum of two positive integers", () => {
    const result = sumar(3, 5);
    expect(result).toBe(8);
  });

  // adding two very large integers
  it("should return the sum of two very large integers", () => {
    const result = sumar(123456789012345, 987654321098765);
    expect(result).toBe(1111111110111110);
  });
});
