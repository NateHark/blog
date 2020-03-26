FROM hugo

VOLUME ["/data"]

EXPOSE 1313

ENTRYPOINT ["/usr/bin/hugo", "--source", "/data"]
