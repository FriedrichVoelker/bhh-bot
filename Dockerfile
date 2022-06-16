FROM node:16.9.1-alpine

# Create the bot's directory
WORKDIR /usr/src/bot

COPY package*.json ./
RUN npm install

COPY . .

# Start the bot.
CMD ["node", "index.js"]