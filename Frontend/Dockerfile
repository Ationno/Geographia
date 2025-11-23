FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG API_URL
ARG MAPBOX_TOKEN

RUN mkdir -p src/environments

RUN cat <<EOF > src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: '${API_URL}',
  mapbox: {
    accessToken: '${MAPBOX_TOKEN}',
    baseUrl: 'https://api.mapbox.com/search/geocode/v6',
  },
};
EOF

RUN cat <<EOF > src/environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: '${API_URL}',
  mapbox: {
    accessToken: '${MAPBOX_TOKEN}',
    baseUrl: 'https://api.mapbox.com/search/geocode/v6',
  },
};
EOF

RUN npm run build

EXPOSE 4200

CMD ["npm", "start"]