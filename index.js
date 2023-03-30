const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.json());


// Define a webhook endpoint for pull_request events
app.post('/webhook', async (req, res) => {
  const { action, pull_request, repository } = req.body;
  if (action === 'opened' || action === 'synchronize') {
    const { owner, name } = repository;
    const { number } = pull_request;
    const diffUrl = `https://api.github.com/repos/${owner}/${name}/pulls/${number}`;
    const diffResponse = await axios.get(diffUrl, {
      headers: {
        Accept: 'application/vnd.github.diff',
        Authorization: `Bearer ${process.env.GITHUB_APP_TOKEN}`,
      },
    });
    const diff = diffResponse.data;
    console.log(`Diff for PR ${number}: ${diff}`);
    console.log("test PR");
    // Process the diff and take any necessary action
  }
  res.status(200).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
