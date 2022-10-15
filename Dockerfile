FROM node:alpine
WORKDIR /home/node/app
COPY src .

RUN npm install
CMD npm run app

# Mostly documentation, could be changed
EXPOSE 9999
