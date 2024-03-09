FROM --platform=x86_64 ubuntu:latest

WORKDIR /var/local
COPY . .

RUN apt-get update && apt-get install -y curl docker unzip

RUN curl -fsSL --proto '=https' https://nextstrain.org/cli/installer/linux | /bin/bash

RUN printf '\n%s\n' 'eval "$("/root/.nextstrain/cli-standalone/nextstrain" init-shell bash)"' >> ~/.bashrc
RUN eval "$("/root/.nextstrain/cli-standalone/nextstrain" init-shell bash)"

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
