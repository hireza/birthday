FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

RUN yarn global add migrate

COPY . .

COPY local.env local.env

RUN sed -i 's/POSTGRES_HOST=127.0.0.1/POSTGRES_HOST=postgresql/g' local.env
RUN sed -i 's/TEMPORAL_HOST=127.0.0.1/TEMPORAL_HOST=temporal/g' local.env

CMD ["npm", "run", "dev"]
