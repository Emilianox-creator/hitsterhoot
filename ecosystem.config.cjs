module.exports = {
    apps: [
      { name: 'ws',  script: 'server/ws-server.js' },
      { name: 'api', script: 'server/api.js', env: { API_PORT: 4000 } },
    ],
  };