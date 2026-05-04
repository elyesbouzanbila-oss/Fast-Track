FROM node:20-alpine

WORKDIR /app

RUN npm install -g http-server

COPY . .

# Inject API_URL into config.js at container start so the frontend
# can reach the correct backend without rebuilding the image.
RUN printf '#!/bin/sh\nif [ -n "$API_URL" ]; then\n  sed -i "s|http://localhost:3000|${API_URL}|g" /app/js/config.js\nfi\nexec http-server /app -p 3001 --cors -c-1\n' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 3001

CMD ["/app/entrypoint.sh"]
