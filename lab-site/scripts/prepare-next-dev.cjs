const net = require('node:net');

const portProbe = net.createServer();
portProbe.once('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('EsiLab frontend is already using port 4001. Stop that frontend before starting another one.');
  } else {
    console.error(`Could not check port 4001: ${error.message}`);
  }
  process.exitCode = 1;
});

portProbe.listen(4001, () => {
  portProbe.close((error) => {
    if (error) throw error;
    console.log('Port 4001 is free. Keeping the Next.js cache for faster startup.');
  });
});
