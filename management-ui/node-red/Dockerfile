FROM alpine

RUN apk update \
    && apk upgrade \
    && apk --no-cache add bash curl

WORKDIR /service
COPY wait-for-port.sh .
COPY node-red-setup.sh .
USER root
RUN chmod +x /service/wait-for-port.sh
RUN chmod +x /service/node-red-setup.sh

#ENTRYPOINT ["tail", "-f", "/dev/null"]
CMD [ "bash", "-c", "/service/wait-for-port.sh node-red:1880 -- /service/node-red-setup.sh"]