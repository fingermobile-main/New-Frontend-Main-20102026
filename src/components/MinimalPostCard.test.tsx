import React, {} from 'react';
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import MinimalPostCard from './MinimalPostCard';

describe("MinimalPostCard", () => {
  it("renders without crashing", () => {
    render(<MinimalPostCard />);
    expect(screen.getByText(/test post/i)).toBeTruthy();
  });
});