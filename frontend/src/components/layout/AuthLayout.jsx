function AuthLayout({children}) {

    return (
        <div className="flex">
            <div className="w-screen h-screen md:w-1/2 px-12 pt-8 pb-12">
                <h2 className="text-xl font-bold text-shadow-md text-shadow-primary/10 text-black tracking-wid">
                    نظر کده
                </h2>
                {children}
            </div>
            <div className="md:block hidden w-1/2 h-screen bg-sky-100 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden relative">
                <div className="absolute h-[240px] w-full border-[35px] border-primary rounded-l-full left-2/5 top-1/12"></div>
                <div className="absolute h-[240px] w-full border-[35px] border-primary rounded-r-full right-2/5 bottom-1/12"></div>
            </div>
        </div>
    );
}

export default AuthLayout;