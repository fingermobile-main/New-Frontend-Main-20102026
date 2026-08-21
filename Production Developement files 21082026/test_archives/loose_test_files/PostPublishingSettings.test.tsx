import React, {} from 'react';
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import PostPublishingSettings from './PostPublishingSettings';

describe("PostPublishingSettings", () => {
  it("renders without crashing", () => {
    render(<PostPublishingSettings />);
    expect(screen.getByText(/publishing settings/i)).toBeTruthy();
  });
});