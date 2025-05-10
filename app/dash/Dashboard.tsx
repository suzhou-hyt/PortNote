import Navbar from "@/components/Navbar"
import { Plus } from "lucide-react"
export default function Dashboard(){
    return (
        <div>
            <Navbar/>
            <div className="grid grid-cols-12 pt-12">
                <div className="col-start-3 col-end-11">
                    <div className="w-full flex gap-2">
                        <label className="input w-full ">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                                >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="text" placeholder="Search..." className="input input-lg outline-none focus:outline-none focus:ring-0 border-0 focus:border-0" />
                        </label>

                        <button className="btn btn-square">
                            <Plus/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}