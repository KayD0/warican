FROM node:18.7.0-alpine

RUN apk update && apk add git
ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo

WORKDIR /usr/src/app