import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedEditorStudio from './EnhancedEditorStudio';

describe('EnhancedEditorStudio', () => {
  it('renders studio header and mandatory caption field', () => {
    render(<EnhancedEditorStudio />);
    expect(screen.getByText(/Postcard & Rich Media Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/Postcard Caption/i)).toBeInTheDocument();
  });

  it('validates mandatory caption before publishing', () => {
    render(<EnhancedEditorStudio />);
    const publishBtn = screen.getByRole('button', { name: /Publish Postcard/i });
    expect(publishBtn).toBeDisabled();

    const textarea = screen.getByPlaceholderText(/Write your postcard message or caption here/i);
    fireEvent.change(textarea, { target: { value: '   ' } });
    expect(publishBtn).toBeDisabled();

    fireEvent.change(textarea, { target: { value: 'Hello Web3 World!' } });
    expect(publishBtn).not.toBeDisabled();
  });

  it('toggles AI-generated content declaration and badge selection', () => {
    render(<EnhancedEditorStudio />);
    const aiCheckbox = screen.getByRole('checkbox');
    expect(aiCheckbox).not.toBeChecked();

    fireEvent.click(aiCheckbox);
    expect(aiCheckbox).toBeChecked();
    expect(screen.getByText(/AI Badge Label:/i)).toBeInTheDocument();
    expect(screen.getByText(/Preview: 🤖 AI-Generated Art/i)).toBeInTheDocument();
  });

  it('renders all 9 attachment trigger buttons', () => {
    render(<EnhancedEditorStudio />);
    expect(screen.getByText('Gift Tip')).toBeInTheDocument();
    expect(screen.getByText('FIC Transfer')).toBeInTheDocument();
    expect(screen.getByText('Commerce')).toBeInTheDocument();
    expect(screen.getByText('BeatwaveNG')).toBeInTheDocument();
    expect(screen.getByText('Voice Note')).toBeInTheDocument();
    expect(screen.getByText('UHD Media')).toBeInTheDocument();
    expect(screen.getByText('Social Link')).toBeInTheDocument();
    expect(screen.getByText('Sticker')).toBeInTheDocument();
    expect(screen.getByText('2GB Chunk')).toBeInTheDocument();
  });
});
