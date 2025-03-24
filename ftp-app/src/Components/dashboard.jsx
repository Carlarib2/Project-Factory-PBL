import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [monitorData, setMonitorData] = useState({
        speed: 0,
        temperature: 0,
        humidity: 0,
        battery: 100,
        motorTemp: 0,
        distance: 0,
        rpm: 0,
        gps: { lat: 0, lng: 0 },
        signalStrength: 100,
        acceleration: { x: 0, y: 0, z: 0 },
        steeringAngle: 0
    });
    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wsConnected, setWsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000');

        ws.onopen = () => {
            console.log('Connected to WebSocket');
            setWsConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMonitorData(data);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket');
            setWsConnected(false);
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('http://localhost:5000/api/serial-commands', {
                serialComms: message
            });
            
            console.log(response.data);

            setMessageHistory(prev => [...prev, {
                text: message,
                timestamp: new Date().toLocaleTimeString(),
                status: 'sent'
            }]);
        } catch (err) {
            console.error(err);
            setError('Failed to send command');
            setMessageHistory(prev => [...prev, {
                text: message,
                timestamp: new Date().toLocaleTimeString(),
                status: 'failed'
            }]);
        } finally {
            setLoading(false);
            setMessage('');
        }
    };

    const handleKeyCommand = async (command) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('http://localhost:5000/api/serial-commands', {
                serialComms: command
            });

            console.log(response.data);
            
            setMessageHistory(prev => [...prev, {
                text: command,
                timestamp: new Date().toLocaleTimeString(),
                status: 'sent'
            }]);
        } catch (err) {
            console.error(err);
            setError('Failed to send command');
            setMessageHistory(prev => [...prev, {
                text: command,
                timestamp: new Date().toLocaleTimeString(),
                status: 'failed'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const renderControlPanel = () => (
        <div className="bg-zinc-900 rounded-xl shadow-lg p-6 mb-8 border border-zinc-800">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-medium text-zinc-300 mb-6">Controls</h3>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="grid grid-cols-3 gap-3 w-64 mb-8">  {/* Changed from w-48 to w-64 */}
                            <div></div>
                            <button
                                onClick={() => handleKeyCommand('forward')}
                                className="p-6 bg-zinc-900/90 rounded-xl hover:bg-zinc-800/90 active:bg-zinc-700/90 transition-all duration-150 transform active:scale-95 border-2 border-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-500/20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <svg className="w-8 h-8 mx-auto text-cyan-400 group-hover:text-cyan-300 relative z-10" fill="none" viewBox="0 0 28 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v7M8 8l4-3l4 3" />
                                </svg>
                            </button>
                            <div></div>
                            
                            <button
                                onClick={() => handleKeyCommand('left')}
                                className="p-6 bg-zinc-900/90 rounded-xl hover:bg-zinc-800/90 active:bg-zinc-700/90 transition-all duration-150 transform active:scale-95 border-2 border-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-500/20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <svg className="w-8 h-8 mx-auto text-cyan-400 group-hover:text-cyan-300 relative z-10" fill="none" viewBox="0 0 28 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h7M8 8l-3 4l3 4" />
                                </svg>
                            </button>
                            
                            <button
                                onClick={() => handleKeyCommand('stop')}
                                className="p-6 bg-zinc-900/90 rounded-xl hover:bg-zinc-800/90 active:bg-zinc-700/90 transition-all duration-150 transform active:scale-95 border-2 border-red-500/30 hover:border-red-400/50 shadow-lg shadow-red-500/20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                                <svg className="w-8 h-8 mx-auto text-red-400 group-hover:text-red-300 relative z-10" fill="none" viewBox="0 0 30 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 8l8 8M16 8l-8 8" />
                                </svg>
                            </button>
                            
                            <button
                                onClick={() => handleKeyCommand('right')}
                                className="p-6 bg-zinc-900/90 rounded-xl hover:bg-zinc-800/90 active:bg-zinc-700/90 transition-all duration-150 transform active:scale-95 border-2 border-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-500/20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <svg className="w-8 h-8 mx-auto text-cyan-400 group-hover:text-cyan-300 relative z-10" fill="none" viewBox="0 0 28 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 12h7M16 8l3 4l-3 4" />
                                </svg>
                            </button>

                            <div></div>
                            <button
                                onClick={() => handleKeyCommand('backward')}
                                className="p-6 bg-zinc-900/90 rounded-xl hover:bg-zinc-800/90 active:bg-zinc-700/90 transition-all duration-150 transform active:scale-95 border-2 border-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-500/20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <svg className="w-8 h-8 mx-auto text-cyan-400 group-hover:text-cyan-300 relative z-10" fill="none" viewBox="0 0 28 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19v-7M8 16l4 3l4-3" />
                                </svg>
                            </button>
                            <div></div>
                        </div>
                        <div className="text-sm text-cyan-400/70 mt-4 font-medium tracking-wide">
                            USE ARROW KEYS OR CLICK TO CONTROL
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-zinc-300 mb-4">Command Console</h3>
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 p-3 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-zinc-500"
                                placeholder="Enter command..."
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </form>

                    <div className="bg-zinc-800 rounded-lg p-4 h-[300px] overflow-y-auto border border-zinc-700">
                        <h4 className="text-sm font-medium text-zinc-300 mb-3">Command History</h4>
                        {messageHistory.length === 0 ? (
                            <p className="text-zinc-500 text-center py-4">No commands sent yet</p>
                        ) : (
                            <div className="space-y-2">
                                {messageHistory.slice().reverse().map((msg, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-zinc-900 rounded-md border border-zinc-800">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs text-zinc-500">{msg.timestamp}</span>
                                            <span className="text-sm text-zinc-300">{msg.text}</span>
                                        </div>
                                        {msg.status === 'failed' && (
                                            <span className="text-xs text-red-400">Failed</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    handleKeyCommand('forward');
                    break;
                case 'ArrowDown':
                    handleKeyCommand('backward');
                    break;
                case 'ArrowLeft':
                    handleKeyCommand('left');
                    break;
                case 'ArrowRight':
                    handleKeyCommand('right');
                    break;
                case ' ':
                    handleKeyCommand('stop');
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-zinc-900 rounded-xl shadow-lg p-6 mb-8 border border-zinc-800">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-white">FTP Control Dashboard</h1>
                            <p className="text-zinc-400 mt-2">Remote Control Car Monitoring System</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-sm text-zinc-400">Status</div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 ${wsConnected ? 'bg-emerald-500' : 'bg-red-500'} rounded-full`}></div>
                                    <span className="font-medium text-zinc-300">
                                        {wsConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-zinc-400">Last Update</div>
                                <div className="font-medium text-zinc-300">
                                    {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">Speed</h2>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{monitorData.speed.toFixed(1)} m/s</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">Battery</h2>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{Math.round(monitorData.battery)}%</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">Motor Temp</h2>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{monitorData.motorTemp.toFixed(1)}°C</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">Distance</h2>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{Math.round(monitorData.distance)}m</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">RPM</h2>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{Math.round(monitorData.rpm)}</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">GPS</h2>
                        </div>
                        <p className="text-sm font-medium text-white mt-2">
                            Lat: {monitorData.gps.lat.toFixed(6)}<br/>
                            Lng: {monitorData.gps.lng.toFixed(6)}
                        </p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01M12 4a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8z" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">Signal</h2>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{Math.round(monitorData.signalStrength)}%</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-zinc-800">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 0l7 7m-7-7l-7 7" />
                            </svg>
                            <h2 className="text-zinc-300 font-medium">Steering</h2>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{monitorData.steeringAngle.toFixed(1)}°</p>
                    </div>
                </div>

                {renderControlPanel()}
            </div>
        </div>
    );
}

export default Dashboard;