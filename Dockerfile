FROM node

WORKDIR /home/downloader

ADD . /home/downloader

RUN npm install -g interfacelift-downloader

VOLUME ["/downloads"]

WORKDIR /downloads

ARG uid=0
ARG gid=0

USER ${uid}:${gid}

ENTRYPOINT ["interfacelift-downloader", "1920x1080", "/downloads"]

CMD ["1"]
