FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]


# cd frontend
# docker build -t task-frontend .
# docker run -p 5173:80 task-frontend
