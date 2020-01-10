const { prisma } = require("./client");

// A `main` function so that we can use async/await
async function main() {
  // Read the previously created user from the database and print their posts to the console
  const postsByUser = await prisma.user({ email: "bob@prisma.io" }).posts();
  console.log(`All posts by that user: ${JSON.stringify(postsByUser)}`);
}

main().catch(e => console.error(e));
