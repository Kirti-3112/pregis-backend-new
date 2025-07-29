# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

# ? Install PM2 globally
RUN npm install -g pm2

# Install app dependencies
RUN npm install

# Copy app code
COPY . .

# Expose port
EXPOSE 3001

COPY .env.example .env

# Start app
CMD ["pm2-runtime", "ecosystem.config.json"]
