docker build -t react-qr-reader .
docker run -p 3030:80 react-qr-reader
docker run -d -p 80:80 josenerydev/my-app


docker tag react-qr-reader josenerydev/my-app
docker push josenerydev/my-app



# Using NVM (Node Version Manager) to install the latest LTS version
nvm install --lts
nvm use --lts


rm -rf node_modules
rm package-lock.json
npm install


# Using NVM to switch to a specific version
nvm install 14 # This installs Node.js v14, for example
nvm use 14
