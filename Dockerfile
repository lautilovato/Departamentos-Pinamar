# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY back/package*.json ./
COPY back/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy backend source code
COPY back/ ./

# Build the application
RUN yarn build

# Verify build completed successfully
RUN echo "🔍 Verifying build..." && \
    ls -la dist/ && \
    if [ ! -f "dist/main.js" ]; then \
        echo "❌ ERROR: dist/main.js not found after build!" && \
        exit 1; \
    else \
        echo "✅ Build verification successful - dist/main.js exists"; \
    fi

# Expose port
EXPOSE 3000

# Start the application with verification
CMD ["sh", "-c", "echo '🚀 Starting application...' && ls -la dist/main.js && node dist/main.js"]