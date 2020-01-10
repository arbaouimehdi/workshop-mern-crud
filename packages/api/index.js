const { prisma } = require("./client");

// A `main` function so that we can use async/await
async function main() {
  // Create a new user with a new post
  const newUser = await prisma.createUser({
    name: "Bob",
    email: "bob@prisma.io",
    posts: {
      create: [
        {
          title: "Join us for GraphQL Conf in 2019"
        },
        {
          title: "Subscribe to GraphQL Weekly for GraphQL news"
        }
      ]
    }
  });
  console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`);

  // Read all users from the database and print them to the console
  const allUsers = await prisma.users();
  console.log(allUsers);

  const allPosts = await prisma.posts();
  console.log(allPosts);
}

main().catch(e => console.error(e));
