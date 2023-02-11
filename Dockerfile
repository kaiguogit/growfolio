# syntax=docker/dockerfile:1

FROM node:10.11.0
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build --production

CMD ["npm", "run", "start"]
EXPOSE 8000