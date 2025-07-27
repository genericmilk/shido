#!/bin/bash

# Shido Installation Script
# This script installs Shido globally and sets up initial configuration

set -e

echo "🚀 Installing Shido - System-wide AI Prompts Manager"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="14.0.0"

if ! command -v npx &> /dev/null; then
    echo "❌ npm is not available. Please ensure npm is installed."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install Shido globally
echo "📦 Installing Shido globally..."
npm install -g shidoai

# Verify installation
if command -v shido &> /dev/null; then
    echo "✅ Shido installed successfully!"
    echo ""
    
    # Run initial setup
    echo "🔧 Running initial setup..."
    shido setup
    
    echo ""
    echo "🎉 Shido is ready to use!"
    echo ""
    echo "Quick start:"
    echo "  shido add my-prompt --prompt 'Your AI prompt here'"
    echo "  shido list"
    echo "  shido use my-prompt"
    echo ""
    echo "For more information, run: shido --help"
    echo "Documentation: https://github.com/yourusername/shido#readme"
else
    echo "❌ Installation failed. Please try again or install manually:"
    echo "   npm install -g shidoai"
    exit 1
fi
