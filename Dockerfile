FROM ubuntu

LABEL version="1.0"
LABEL description="First docker-ized version of RR Coach"

# init image
RUN apt-get clean
RUN apt-get update
RUN apt-get -qy upgrade

# essential programs
RUN apt-get install -qy vim
RUN apt-get install -qy npm
RUN apt-get install -qy build-essential
RUN apt-get install -qy nodejs
RUN apt-get install -qy git
RUN apt-get install -qy curl

# troubleshooting
RUN apt-get install -qy iputils-ping
RUN apt-get install -qy iproute2

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -qy yarn;

# cleanup unnecessary stuff
RUN apt-get -qy autoremove

# copy app logic
ADD backend /app

# install application dependencies
WORKDIR /app
RUN yarn install --production=true

# run application
CMD node server.js
EXPOSE 3000
