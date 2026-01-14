import { prisma } from "../lib/prisma"
import { UserRole } from "../middlewere/auth"

async function seedAdmiin() {
    try {
        const adminData = {
            name: "admin",
            email: "admin@admin.com",
            role: UserRole.ADMIN,
            password: "admin123456",
            emailVerified: true
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        if (existingUser) {
            throw new Error("User Already exists!!")
        }

        const signupAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
            body: JSON.stringify(adminData)
        })

        console.log(signupAdmin);
        if (signupAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
            console.log("Email Verification Success");
        }
    } catch (error) {
        console.error(error)
    }
}
seedAdmiin();