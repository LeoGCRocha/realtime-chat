# FROM node
# WORKDIR /home/node/app
# COPY app/package.json app/package-lock.json /home/node/app/
# RUN npm install
# COPY app/public /home/node/app/public
# COPY app/server.js /home/node/app/
# VOLUME /app /home/node/app
# # TODO: Change this in last version
# CMD ["npm" , "run", "dev"]
FROM node
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install --save-global
# COPY app/package.json app/package-lock.json /home/node/app/
# RUN npm install
WORKDIR /home/node/app/src
COPY . .
# VOLUME . /home/node/app/src
# TODO: Change this in last version
CMD ["npm" , "run", "dev"]