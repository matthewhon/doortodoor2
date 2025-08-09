FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production || npm i --production
COPY . .
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["npm","start"]
