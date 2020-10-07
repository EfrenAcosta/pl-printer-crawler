FROM node:12.13.1

#install chrome
# Make sure decent fonts are installed. Thanks to http://www.dailylinuxnews.com/blog/2014/09/things-to-do-after-installing-debian-jessie/
RUN echo "deb http://ftp.us.debian.org/debian jessie main contrib non-free" | tee -a /etc/apt/sources.list
RUN echo "deb http://security.debian.org/ jessie/updates contrib non-free" | tee -a /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y ttf-freefont ttf-mscorefonts-installer ttf-bitstream-vera ttf-dejavu ttf-liberation

# Make sure a recent (>6.7.7-10) version of ImageMagick is installed.
RUN apt-get install -y imagemagick

# install chrome and chromedriver (unzip is needed for installing chromedriver)
#install chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb || true
RUN apt-get -fy install

RUN google-chrome --version

# set working directory
WORKDIR /opt/node_app

# install app dependencies
#COPY package.json ./
COPY . ./

RUN npm install --no-optional && npm cache clean --force 

# add `/opt/node_app/node_modules/.bin` to $PATH
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# set working directory
WORKDIR /opt/node_app/app

COPY . .

# start app
CMD ["npm", "start"]