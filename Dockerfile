FROM node:20

WORKDIR /app

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

# Ensure the NestJS CLI is in PATH
ENV PATH=$PATH:/root/.yarn/bin

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --ignore-engines

# Copy the application source
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

# Expose API port
EXPOSE 3000

# Start the application
CMD ["yarn", "start:watch"]