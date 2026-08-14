import mongoose, {ConnectOptions} from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if(!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable in (.env.local)");
}

// 1. Define a clear interface using the imported mongoose type
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// 2. Extend globalThis without using 'typeof mongoose' directly inside 'var mongoose'
declare global {
    var mongooseCache: MongooseCache | undefined;
}

// 3. Initialize or retrieve the cache from globalThis
let cached = globalThis.mongooseCache;   

if(!cached) {
    cached = globalThis.mongooseCache = {conn: null, promise: null};
}

async function dbConnect(): Promise<typeof mongoose>  {
    // Guarranted non-null cache because of the initialization check above
    const currentCache = cached!; 
    
    if(currentCache.conn) {
        return currentCache.conn;
    }

    if(!currentCache.promise) {
        const opts: ConnectOptions = {
            bufferCommands: false, 
            maxIdleTimeMS: 10000, 
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 20000
        };

        currentCache.promise = mongoose.connect(MONGO_URI, opts).then((m) => m);
    }

    try{
        currentCache.conn = await currentCache.promise;
    } catch(err) {
        currentCache.promise = null;
        throw new Error(String(err));
    }
    return currentCache.conn;
}

export default dbConnect;
