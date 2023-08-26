FROM node:18.17.1-alpine

# Create the bot's directory
WORKDIR /usr/src/bot

COPY package*.json ./
RUN npm install

COPY . .

# Start the bot.
CMD ["npm", "run", "start"]