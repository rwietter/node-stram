db = db.getSiblingDB('covid');
db.createUser({
  user: 'rwietter',
  pwd: 'rw19',
  roles: [{ role: 'readWrite', db: 'covid' }]
});
