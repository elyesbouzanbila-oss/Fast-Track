FROM node:20-alpine

WORKDIR /app

# Serve static files
RUN npm install -g http-server

COPY . .

EXPOSE 3001

CMD ["http-server", "-p", "3001"]
