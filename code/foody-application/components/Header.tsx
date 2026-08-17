import AuthElement from "@/components/auth-element";
import Logo from "@/components/Logo";

const Header = () => {
    return(
        <header className="border-b border-neutral-500 shadow-md shadow-neutral-800 px-10 py-4 flex items-center gap-10 justify-between container mx-auto">
            <div className="flex items-center gap-2 text-green-500 font-semibold text-lg">
                <Logo />
                Foody
            </div>

            <AuthElement />
        </header>
    );
}

export default Header;
