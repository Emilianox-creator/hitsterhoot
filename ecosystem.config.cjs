module.exports = {
    apps: [
      { name: 'ws',  script: 'server.js' },
      { name: 'api', script: 'api.js', env: { API_PORT: 4000 } },
    ],
  };