docker build -t react-qr-reader .
docker run -p 3030:80 react-qr-reader
docker run -d -p 80:80 josenerydev/my-app


docker tag react-qr-reader josenerydev/my-app
docker push josenerydev/my-app