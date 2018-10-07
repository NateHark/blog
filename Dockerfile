FROM registry:5000/hugo

VOLUME ["/data"]

EXPOSE 1313

ENTRYPOINT ["/usr/bin/hugo", "--source", "/data"]
