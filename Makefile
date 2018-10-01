MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
CWD := $(dir $(MAKEFILE_PATH))

HOSTNAME := $(shell hostname)
PORT := 1313

DOCKER_REPO := registry:5000
BLOG_CONTAINER := blog

docker: # builds and pushes the Docker container
	docker build --no-cache --tag $(BLOG_CONTAINER) --tag $(DOCKER_REPO)/$(BLOG_CONTAINER) .
	docker push $(DOCKER_REPO)/$(BLOG_CONTAINER)

post: # creates a new post
	docker run --rm --name $(BLOG_CONTAINER) -v $(CWD):/data -p 0.0.0.0:$(PORT):$(PORT) $(BLOG_CONTAINER) new $(POST)

server: # runs the local hugo webserver
	docker run --rm --name $(BLOG_CONTAINER) -v $(CWD):/data -p 0.0.0.0:$(PORT):$(PORT) $(BLOG_CONTAINER) -w --buildDrafts --bind 0.0.0.0 --baseURL $(HOSTNAME):$(PORT) server

site: # builds the static website
	docker run --rm --name $(BLOG_CONTAINER) -v $(CWD):/data -p 0.0.0.0:$(PORT):$(PORT) $(BLOG_CONTAINER) --buildDrafts
