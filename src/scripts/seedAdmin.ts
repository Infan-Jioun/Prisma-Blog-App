import { prisma } from "../lib/prisma"
import { UserRole } from "../middlewere/auth"

async function seedAdmiin() {
    try {
        const adminData = {
            name: "Infan",
            email: "admin@admin.com",
            role: UserRole.ADMIN,
            password: "admin123456"
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        if (existingUser) {
            throw new Error("User Already exists")
        }
        const signupAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: { "Content-Type": "application/josn" },
            body: JSON.stringify(adminData)
        })
        console.log(existingUser);
    } catch (error) {
        console.error(error)
    }
}
``