MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
CWD := $(dir $(MAKEFILE_PATH))

HOSTNAME := $(shell hostname)
PORT := 1313

DOCKER_REPO := registry:5000
BLOG_CONTAINER := blog
S3_BUCKET := nathanharkenrider.com

docker: # builds and pushes the Docker container
	docker build --no-cache --tag $(BLOG_CONTAINER) --tag $(DOCKER_REPO)/$(BLOG_CONTAINER) .
	docker push $(DOCKER_REPO)/$(BLOG_CONTAINER)

deploy: # deploys to S3 and invalidates the CloudFront distribution
	docker run --rm -v $(CWD):/data -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} -e AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} aws \
		s3 sync --delete /data/public/ s3://$(S3_BUCKET)

	docker run --rm -v $(CWD):/data -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} -e AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} aws \
		cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths /\*

post: # creates a new post
	docker run --rm --user $(shell id -u):$(shell id -u) -v $(CWD):/data $(BLOG_CONTAINER) new $(POST)

server: # runs the local hugo webserver
	docker run --rm --user $(shell id -u):$(shell id -u) -v $(CWD):/data  $(BLOG_CONTAINER) -w --buildDrafts --bind 0.0.0.0 --baseURL $(HOSTNAME):$(PORT) server

site: # builds the static website
	docker run --rm --user $(shell id -u):$(shell id -u) -v $(CWD):/data -p 0.0.0.0:$(PORT):$(PORT) $(BLOG_CONTAINER) --buildDrafts
