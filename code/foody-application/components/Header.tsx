import Logo from "./Logo";

const Header = () => {
    return(
        <header className="border-b border-neutral-500 shadow-md shadow-neutral-800 px-10 py-4 flex items-center gap-10 justify-between">
            <div className="flex items-center gap-2 text-green-500 font-semibold text-lg">
                <Logo />
                Foody
            </div>


        </header>
    );
}

export default Header;
