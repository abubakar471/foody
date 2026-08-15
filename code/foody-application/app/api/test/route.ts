import dbConnect from "@/middleware/db-connect";
import Location from "@/mongoose/locations/model";
import {NextResponse} from "next/server";

export async function GET() {
    await dbConnect();

    const locations = await Location.find({}).limit(6);

    return NextResponse.json(locations, {status: 200});
}
