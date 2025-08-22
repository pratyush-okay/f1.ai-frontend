# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json yarn.lock* pnpm-lock.yaml* ./
# Install dependencies based on the lock file present
RUN \ 
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else npm install --force; \
  fi

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables for Next.js production
ENV NODE_ENV production

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js listens on
EXPOSE 3000

# Command to run the Next.js application in production mode
CMD ["npm", "start"]