import { UserService } from "@/services/user.service";
import { NextResponse } from "next/server";

export async function GET(){
    try {

        const result = await UserService.getAllUsers();
        const data = result.data.map((user) => ({
            ...user,
            id: user.id.toString(),
        }));

        return NextResponse.json({ success: result.success, data }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}