"use client";
import Navbar from "@/components/Navbar"
import { Plus } from "lucide-react"

import { useEffect, useState } from "react";


export default function Dashboard(){
    const [isVm, setIsVm] = useState(false);

    const [type, setType] = useState(0);
    const [serverName, setServerName] = useState("");
    const [serverIP, setServerIP] = useState("");
    const [serverHost, setServerHost] = useState(0)
    const [portServer, setPortServer] = useState(0)
    const [portNote, setPortNote] = useState("")
    const [portPort, setPortPort] = useState(0)


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

                        <button className="btn btn-square" onClick={() => (document.getElementById('add') as HTMLDialogElement)?.showModal()}>
                            <Plus/>
                        </button>
                        <dialog id="add" className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg pb-2">Create a...</h3>
                                <div className="tabs tabs-box">
                                    <input type="radio" name="my_tabs_6" className="tab" aria-label="Server" defaultChecked />
                                    <div className="tab-content bg-base-100 border-base-300 p-6 space-y-2">
                                        <input type="text" placeholder="Name" className="input w-full" />
                                        <input type="text" placeholder="IP" className="input w-full" />
                                        <span className="text-sm text-gray-500">Is the server a VM?</span>
                                        <div className="flex gap-2 items-center w-full">
                                            <input 
                                                type="checkbox" 
                                                className="checkbox" 
                                                checked={isVm}
                                                onChange={(e) => setIsVm(e.target.checked)}
                                            />
                                            {isVm && (
                                                <select defaultValue="Select a host server" className="select w-full">
                                                    <option disabled>Select a Server</option>
                                                    <option>Server 1</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    <input type="radio" name="my_tabs_6" className="tab" aria-label="Port" />
                                    <div className="tab-content bg-base-100 border-base-300 p-6 space-y-2">
                                        <select defaultValue="Select a host server" className="select w-full">
                                            <option disabled>Select a Server</option>
                                            <option>Server 1</option>
                                        </select>
                                        <input type="text" placeholder="Note" className="input w-full" />
                                        <input type="number" placeholder="Port" className="input w-full" />
                                    </div>
                                </div>
                                <div className="modal-action mt-auto pt-2">
                                    <form method="dialog">
                                        <button className="btn">Add</button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}