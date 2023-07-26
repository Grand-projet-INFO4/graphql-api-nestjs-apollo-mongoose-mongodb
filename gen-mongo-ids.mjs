import { mongo } from 'mongoose';

const count = 23;

function generateMongoIds(count = 1) {
  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(new mongo.ObjectId().toJSON());
  }
  return ids;
}

console.log(generateMongoIds(count));
process.exit(1);
