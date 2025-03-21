const express = require('express');
const awsRoutes = require('./routes/awsRoutes');
const app = express();

app.use(express.json());
app.use('/api', awsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});