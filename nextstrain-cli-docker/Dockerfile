FROM --platform=x86_64 ubuntu:latest
WORKDIR /var/local
COPY . .

RUN apt-get update
RUN apt-get install -y ca-certificates curl
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update && apt-get install -y curl docker-ce unzip

RUN curl -fsSL --proto '=https' https://nextstrain.org/cli/installer/linux | /bin/bash

RUN printf '\n%s\n' 'eval "$("/root/.nextstrain/cli-standalone/nextstrain" init-shell bash)"' >> ~/.bashrc
RUN eval "$("/root/.nextstrain/cli-standalone/nextstrain" init-shell bash)"

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
