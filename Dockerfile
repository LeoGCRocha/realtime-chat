FROM node
WORKDIR /home/node/app
COPY app/package.json app/package-lock.json /home/node/app/
RUN pwd
RUN ls
RUN npm install
COPY app/public /home/node/app/public
COPY app/server.js /home/node/app/
RUN pwd
RUN ls
CMD node server.js
