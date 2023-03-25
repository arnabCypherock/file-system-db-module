export * from './fileDatabase';

// (async () => {
//     // create a new database
//     const db = new FileDatabase("db.json");

//     // set a value
//     await db.set("name", "John Doe");
//     await db.set("account", "Ethereum");

//     // get a value
//     const name = await db.get("name");
//     console.log(name);

//     // get a value of a non-existing key
//     const age = await db.get("age");
//     console.log(age);

//     // update a value
//     await db.update("name", "Jane Doe");

//     // get a value
//     const newName = await db.get("name");
//     console.log(newName);
// })();
