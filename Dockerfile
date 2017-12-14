FROM node

WORKDIR /home/downloader

RUN git clone https://github.com/stevenbenner/interfacelift-downloader.git && \
    npm install -g interfacelift-downloader

VOLUME ["/downloads"]

WORKDIR /downloads

ARG uid=0
ARG gid=0

USER ${uid}:${gid}

ENTRYPOINT ["interfacelift-downloader", "1920x1080", "/downloads"]

CMD ["1"]
