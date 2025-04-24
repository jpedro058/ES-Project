FROM python:3.11

# From https://gist.github.com/MichalZalecki/4a87880bbe7a3a5428b5aebebaa5cd97
ARG USER_NAME="main"
ARG USER_PASSWORD="main"

ENV USER_NAME $USER_NAME
ENV USER_PASSWORD $USER_PASSWORD
ENV CONTAINER_IMAGE_VER=v1.0.0
ENV PATH "/home/main/.local/bin:/home/main/.ebcli-virtual-env/executables:$PATH"

RUN echo $USER_NAME
RUN echo $USER_PASSWORD
RUN echo $CONTAINER_IMAGE_VER

# Install the tools I wish to use
RUN apt-get update && \
  apt-get install -y sudo \
  vim \
  curl \
  git-core \
  groff \
  locales \
  zsh \
  wget \
  zip \
  && locale-gen en_US.UTF-8 \
  && adduser --quiet --disabled-password --shell /bin/zsh --home /home/$USER_NAME --gecos "User" $USER_NAME \
  && echo "${USER_NAME}:${USER_PASSWORD}" | chpasswd && usermod -aG sudo $USER_NAME

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs && \
  node -v && npm -v

# Install Python tools
RUN sh -c "/usr/local/bin/python -m pip install --upgrade pip"
RUN sh -c "pip install virtualenv"
RUN sh -c "git clone https://github.com/aws/aws-elastic-beanstalk-cli-setup.git"

# The user we're applying this to (otherwise it most likely installs for root)
USER $USER_NAME
# Terminal colors with xterm
ENV TERM xterm
# Set the zsh theme
ENV ZSH_THEME robbyrussell

RUN sh -c "python /aws-elastic-beanstalk-cli-setup/scripts/ebcli_installer.py"

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
  && apt-get install -y nodejs

# Copy frontend files and install dependencies
COPY ./frontend/package.json ./frontend/package-lock.json /home/$USER_NAME/frontend/
WORKDIR /home/$USER_NAME/frontend
RUN npm install

# Optional: Build React app (useful for production)
# RUN npm run build

# Expose port (if serving on a different port)
EXPOSE 3000

# Start zsh (or you could start the React app here with `npm start`)
CMD ["zsh"]
