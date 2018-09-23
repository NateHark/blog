FROM alpine:latest

VOLUME ["/data"]

RUN wget --quiet -O /tmp/hugo.tar.gz \
        https://github.com/gohugoio/hugo/releases/download/v0.48/hugo_0.48_Linux-64bit.tar.gz && \
    tar -zxf /tmp/hugo.tar.gz -C /tmp && \
    cp /tmp/hugo /usr/bin/hugo

EXPOSE 1313/tcp

WORKDIR /data

ENTRYPOINT ["hugo", "-w", "--buildDrafts", "-d", "/data/public",  "--bind", "0.0.0.0"]
CMD ["server"]
