import React, {} from 'react';
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import EnhancedEditorStudio from './EnhancedEditorStudio';

describe("EnhancedEditorStudio", () => {
  it("renders without crashing", () => {
    render(<EnhancedEditorStudio />);
    expect(screen.getByText(/editor studio/i)).toBeTruthy();
  });
});