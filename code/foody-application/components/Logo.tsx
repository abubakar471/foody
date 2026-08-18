import Link from "next/link";

const Logo = () => {
    return(
        <Link href={"/"}>
            <div className="bg-green-500 text-white text-lg flex items-center justify-center rounded-lg shadow p-4 w-6 h-6">
                F
            </div>
        </Link>
    )
}

export default Logo;
