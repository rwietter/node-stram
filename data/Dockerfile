FROM mongo:latest

WORKDIR /app
VOLUME /data/db

COPY out.json /app/

# ENV MONGO_INITDB_ROOT_USERNAME=
# ENV MONGO_INITDB_ROOT_PASSWORD=
# ENV MONGO_INITDB_DATABASE=

COPY init.js /docker-entrypoint-initdb.d/

CMD mongod --bind_ip_all

# build image: docker build -t covid-db:1.2 .

# mongosh
# use covid
# db.createUser({ user: "rwietter", pwd: "rw19", roles: [ { role: "readWrite", db: "covid" } ]})
# db.createCollection('covid_2022')
# mongoimport --db covid --collection covid_2022 --file out.json --jsonArray
# db.getUsers()
# docker commit -m "Preserving MongoDB data" my-mongodb my-mongodb-with-data
