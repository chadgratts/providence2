FROM node:20 as base

WORKDIR /app

COPY package*.json ./

FROM base as development
RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev"]