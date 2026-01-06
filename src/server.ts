import { prisma } from "./lib/prisma";

async function main() {
    try {
        await prisma.$connect();
        console.log("Successfully Connect to Database");
    } catch {
        console.error("Doesn't Connect to Database")
    }
}
main();