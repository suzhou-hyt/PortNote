export default function Navbar(){
    return(
        <div className="navbar bg-base-200 shadow-sm">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">PortNote</a>
            </div>
            <div className="navbar-center hidden lg:flex">
            </div>
            <div className="navbar-end">
                <a className="btn btn-soft btn-error">Logout</a>
            </div>
         </div>
    )
}