const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => {
    console.log('MongoDB: Connected');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

module.exports = mongoose.connection;
