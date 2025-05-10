"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Navbar(){
    const router = useRouter()

    const logout = async () => {
        Cookies.remove("token")
        router.push("/")
    }

    return(
        <div className="navbar bg-base-200 shadow-sm">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">PortNote</a>
            </div>
            <div className="navbar-center hidden lg:flex">
            </div>
            <div className="navbar-end">
                <a className="btn btn-soft btn-error" onClick={logout}>Logout</a>
            </div>
         </div>
    )
}