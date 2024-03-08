import { setupApp } from "setup-app";

(async () => {
  const app = await setupApp();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})();
