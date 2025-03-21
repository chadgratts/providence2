async function checkInactiveSessions() {

}

async function runWorker() {
  while (true) {
    try {
      await checkInactiveSessions();
    } catch (error) {
      console.error('Error in worker loop:', error);
    }
  }
}

runWorker();