FROM node:22.14.0-alpine3.21
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN sed -i 's/\r$//' ./run_tests.sh
RUN chmod +x ./run_tests.sh
CMD ["sh"]
