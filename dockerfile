FROM node
WORKDIR /app
RUN git clone https://github.com/ebarnabas644/Zefir-game-server.git .
RUN npm i
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 3000