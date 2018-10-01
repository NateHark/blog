FROM registry:5000/hugo

VOLUME ["/data"]

EXPOSE 1313

ENTRYPOINT ["/usr/bin/hugo", "--log", "--logFile", "/var/log/hugo.log", "--verboseLog", "--source", "/data"]
