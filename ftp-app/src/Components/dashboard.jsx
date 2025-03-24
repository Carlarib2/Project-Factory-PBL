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

    const renderKeyboardControls = () => (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Keyboard Controls</h3>
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                <div></div>
                <button
                    onClick={() => handleKeyCommand('forward')}
                    className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
                <div></div>
                
                <button
                    onClick={() => handleKeyCommand('left')}
                    className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <button
                    onClick={() => handleKeyCommand('stop')}
                    className="p-4 bg-red-100 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
                >
                    <svg className="w-6 h-6 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <button
                    onClick={() => handleKeyCommand('right')}
                    className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div></div>
                <button
                    onClick={() => handleKeyCommand('backward')}
                    className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div></div>
            </div>
            <div className="text-sm text-gray-500 text-center mt-4">
                Use arrow keys or click buttons to control
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
                case ' ': // Space bar
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">FTP Control Dashboard</h1>
                            <p className="text-gray-500 mt-2">Remote Control Car Monitoring System</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Status</div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 ${wsConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                                    <span className="font-medium text-gray-700">
                                        {wsConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Last Update</div>
                                <div className="font-medium text-gray-700">
                                    {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">Speed</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{monitorData.speed.toFixed(1)} m/s</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">Battery</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(monitorData.battery)}%</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">Motor Temp</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{monitorData.motorTemp.toFixed(1)}°C</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">Distance</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(monitorData.distance)}m</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">RPM</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(monitorData.rpm)}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">GPS</h2>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mt-2">
                            Lat: {monitorData.gps.lat.toFixed(6)}<br/>
                            Lng: {monitorData.gps.lng.toFixed(6)}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01M12 4a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8z" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">Signal</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(monitorData.signalStrength)}%</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 0l7 7m-7-7l-7 7" />
                            </svg>
                            <h2 className="text-gray-600 font-medium">Steering</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{monitorData.steeringAngle.toFixed(1)}°</p>
                    </div>
                </div>

                {renderKeyboardControls()}

                <div className="bg-white rounded-xl shadow-sm p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter Serial Command"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Serial Commands Log</h3>
                        {messageHistory.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No commands sent yet</p>
                        ) : (
                            messageHistory.slice().reverse().map((msg, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-500">{msg.timestamp}</span>
                                        <span className="text-gray-700">{msg.text}</span>
                                    </div>
                                    {msg.status === 'failed' && (
                                        <span className="text-sm text-red-500">Failed</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;