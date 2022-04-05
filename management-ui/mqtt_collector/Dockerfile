FROM python:3.10-slim-buster

COPY ./ /app
WORKDIR /app
RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["__main__.py"]