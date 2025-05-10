"use client";
import Navbar from "@/components/Navbar";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Server {
  id: number;
  name: string;
  ip: string;
  host: number | null;
  ports: Port[];
}

interface Port {
  id: number;
  serverId: number;
  note: string | null;
  port: number;
}

export default function Dashboard() {
  const [servers, setServers] = useState<Server[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form States
  const [isVm, setIsVm] = useState(false);
  const [type, setType] = useState(0);
  const [serverName, setServerName] = useState("");
  const [serverIP, setServerIP] = useState("");
  const [serverHost, setServerHost] = useState<number | null>(null);
  const [portServer, setPortServer] = useState<number | null>(null);
  const [portNote, setPortNote] = useState("");
  const [portPort, setPortPort] = useState<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Server[]>("/api/get");
      setServers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.ip.includes(searchQuery)
  );

  // Group servers by host
  const hostServers = filteredServers.filter(server => server.host === null);
  const vmsByHost = filteredServers.reduce((acc, server) => {
    if (server.host !== null) {
      if (!acc[server.host]) acc[server.host] = [];
      acc[server.host].push(server);
    }
    return acc;
  }, {} as Record<number, Server[]>);

  const handleSubmit = async () => {
    try {
      const payload = type === 0 ? {
        type,
        serverName,
        serverIP,
        serverHost: isVm ? serverHost : null
      } : {
        type,
        portServer,
        portNote,
        portPort
      };

      await axios.post("/api/add", payload);
      await fetchData();
      (document.getElementById('add') as HTMLDialogElement)?.close();
      resetForm();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const resetForm = () => {
    setType(0);
    setServerName("");
    setServerIP("");
    setIsVm(false);
    setServerHost(null);
    setPortServer(null);
    setPortNote("");
    setPortPort(null);
  };

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-12 pt-12">
        <div className="col-start-3 col-end-11">
          <div className="w-full flex gap-2">
            <label className="input w-full ">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                {/* Search Icon */}
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                className="input input-lg outline-none focus:outline-none focus:ring-0 border-0 focus:border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>

            <button className="btn btn-square" onClick={() => (document.getElementById('add') as HTMLDialogElement)?.showModal()}>
              <Plus/>
            </button>
            
            {/* Add Dialog */}
            <dialog id="add" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg pb-2">Create a...</h3>
                <div className="tabs tabs-box">
                  {/* Server Tab */}
                  <input 
                    type="radio" 
                    name="type" 
                    className="tab" 
                    aria-label="Server" 
                    defaultChecked 
                    onChange={() => setType(0)}
                  />
                  <div className="tab-content bg-base-100 border-base-300 p-6 space-y-2">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      className="input w-full"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="IP" 
                      className="input w-full"
                      value={serverIP}
                      onChange={(e) => setServerIP(e.target.value)}
                    />
                    <div className="flex gap-2 items-center">
                      <label className="label cursor-pointer">
                        <span className="label-text">Is VM?</span>
                        <input 
                          type="checkbox" 
                          className="checkbox" 
                          checked={isVm}
                          onChange={(e) => setIsVm(e.target.checked)}
                        />
                      </label>
                      {isVm && (
                        <select 
                          className="select select-bordered w-full"
                          value={serverHost || ""}
                          onChange={(e) => setServerHost(Number(e.target.value))}
                        >
                          <option disabled value="">Select Host</option>
                          {hostServers.map(server => (
                            <option key={server.id} value={server.id}>
                              {server.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Port Tab */}
                  <input 
                    type="radio" 
                    name="type" 
                    className="tab" 
                    aria-label="Port" 
                    onChange={() => setType(1)}
                  />
                  <div className="tab-content bg-base-100 border-base-300 p-6 space-y-2">
                    <select 
                      className="select w-full"
                      value={portServer || ""}
                      onChange={(e) => setPortServer(Number(e.target.value))}
                    >
                      <option disabled value="">Select Server</option>
                      {servers.map(server => (
                        <option key={server.id} value={server.id}>
                          {server.name}
                        </option>
                      ))}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Note" 
                      className="input w-full"
                      value={portNote}
                      onChange={(e) => setPortNote(e.target.value)}
                    />
                    <input 
                      type="number" 
                      placeholder="Port" 
                      className="input w-full"
                      value={portPort || ""}
                      onChange={(e) => setPortPort(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="modal-action mt-auto pt-2">
                  <button className="btn" onClick={handleSubmit}>Add</button>
                  <button className="btn btn-ghost" onClick={() => (document.getElementById('add') as HTMLDialogElement)?.close()}>
                    Cancel
                  </button>
                </div>
              </div>
            </dialog>
          </div>

          {/* Server List */}
          <div className="mt-8 space-y-4">
            {hostServers.map(server => (
              <div key={server.id} className="bg-base-200 p-4 rounded-lg">
                <div className="font-bold text-lg">{server.name}</div>
                <div className="text-sm opacity-75">{server.ip}</div>
                
                {/* Ports */}
                {server.ports.map(port => (
                  <div key={port.id} className="ml-4 mt-2">
                    <div className="badge badge-neutral">{port.port}</div>
                    <span className="ml-2 text-sm">{port.note}</span>
                  </div>
                ))}

                {/* VMs */}
                {vmsByHost[server.id]?.map(vm => (
                  <div key={vm.id} className="ml-4 mt-4 border-l-2 pl-4">
                    <div className="font-medium">🖥️ {vm.name}</div>
                    <div className="text-sm opacity-75">{vm.ip}</div>
                    {vm.ports.map(port => (
                      <div key={port.id} className="ml-4 mt-2">
                        <div className="badge badge-neutral">{port.port}</div>
                        <span className="ml-2 text-sm">{port.note}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}