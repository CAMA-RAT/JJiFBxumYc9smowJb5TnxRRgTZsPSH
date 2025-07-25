import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar, Table, ChevronLeft, ChevronRight, X, Upload, Save, Undo, Edit, Download, CheckCircle, Clock } from 'lucide-react';

// --- SIMULACIÓN DE IMPORTACIÓN DE DATOS ---
// En un proyecto real, importarías tu archivo JSON así:
// import dbData from './DB.json';
// Por ahora, usamos este objeto como si fuera el archivo importado.
const dbData = [
    
];


// --- PALETA DE COLORES PARA MESES ---
const monthColors = {
    0: { bg: 'bg-red-500', text: 'text-red-800', lightBg: 'bg-red-100', border: 'border-red-500' },
    1: { bg: 'bg-pink-500', text: 'text-pink-800', lightBg: 'bg-pink-100', border: 'border-pink-500' },
    2: { bg: 'bg-purple-500', text: 'text-purple-800', lightBg: 'bg-purple-100', border: 'border-purple-500' },
    3: { bg: 'bg-blue-500', text: 'text-blue-800', lightBg: 'bg-blue-100', border: 'border-blue-500' },
    4: { bg: 'bg-sky-500', text: 'text-sky-800', lightBg: 'bg-sky-100', border: 'border-sky-500' },
    5: { bg: 'bg-cyan-500', text: 'text-cyan-800', lightBg: 'bg-cyan-100', border: 'border-cyan-500' },
    6: { bg: 'bg-teal-500', text: 'text-teal-800', lightBg: 'bg-teal-100', border: 'border-teal-500' },
    7: { bg: 'bg-emerald-500', text: 'text-emerald-800', lightBg: 'bg-emerald-100', border: 'border-emerald-500' },
    8: { bg: 'bg-green-500', text: 'text-green-800', lightBg: 'bg-green-100', border: 'border-green-500' },
    9: { bg: 'bg-lime-500', text: 'text-lime-800', lightBg: 'bg-lime-100', border: 'border-lime-500' },
    10: { bg: 'bg-yellow-500', text: 'text-yellow-800', lightBg: 'bg-yellow-100', border: 'border-yellow-500' },
    11: { bg: 'bg-amber-500', text: 'text-amber-800', lightBg: 'bg-amber-100', border: 'border-amber-500' }
};
// --- COMPONENTES ---

const CalendarDayDetail = ({ deliveries, onClose }) => {
    if (!deliveries || deliveries.length === 0) return null;
    const month = new Date(deliveries[0]['FECHA DE ENTREGA']).getMonth();
    const color = monthColors[month];

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] z-40 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div
                className={`relative z-50 w-full max-w-lg p-6 rounded-lg shadow-2xl ${color.lightBg} border ${color.border} max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className={`absolute top-3 right-3 p-1 rounded-full hover:${color.bg} hover:text-white ${color.text}`}>
                    <X size={20}/>
                </button>
                <div className="mb-4">
                    <h4 className={`font-bold text-lg ${color.text}`}>
                        {deliveries.length} Entrega{deliveries.length > 1 ? 's' : ''} el {new Date(deliveries[0]['FECHA DE ENTREGA']).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                    </h4>
                </div>
                <div className="space-y-4">
                    {deliveries.map((delivery, index) => (
                        <div key={index} className="text-sm border-t pt-3 first:border-t-0">
                            {deliveries.length > 1 && <h5 className={`font-semibold ${color.text} mb-2`}>Entrega #{index + 1}</h5>}
                            <ul className="space-y-1">
                                {delivery.CANTIDAD && <li><strong>Cantidad:</strong> {delivery.CANTIDAD}</li>}
                                {delivery.CEPA && <li><strong>Cepa:</strong> {delivery.CEPA}</li>}
                                {delivery.SEXO && <li><strong>Sexo:</strong> {delivery.SEXO}</li>}
                                {delivery.SEMANAS && <li><strong>Semanas:</strong> {delivery.SEMANAS}</li>}
                                {delivery.PESO && <li><strong>Peso:</strong> {delivery.PESO}</li>}
                                {delivery.CLIENTE && <li><strong>Cliente:</strong> {delivery.CLIENTE}</li>}
                                {delivery.RECIBE && <li><strong>Recibe:</strong> {delivery.RECIBE}</li>}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CalendarView = ({ records, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1));
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const deliveriesByDay = useMemo(() => {
        const map = new Map();
        records.forEach(r => {
            const date = new Date(r['FECHA DE ENTREGA']);
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            const dateStr = date.toISOString().split('T')[0];
            if (!map.has(dateStr)) map.set(dateStr, []);
            map.get(dateStr).push(r);
        });
        return map;
    }, [records]);

    const changeMonth = (offset) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));

    const renderHeader = () => (
        <div className="flex items-center justify-between px-2 py-3 bg-gray-50 rounded-t-lg">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ChevronLeft size={20} /></button>
            <h2 className="font-bold text-lg text-gray-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ChevronRight size={20} /></button>
        </div>
    );

    const renderDays = () => (
        <div className="grid grid-cols-7 text-center font-medium text-gray-500 border-b bg-gray-50">
            {daysOfWeek.map(day => <div key={day} className="py-2 text-xs uppercase">{day}</div>)}
        </div>
    );

    const renderCells = () => {
        const month = currentDate.getMonth(), year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];
        for (let i = 0; i < firstDayOfMonth; i++) cells.push(<div key={`empty-${i}`} className="border-r border-b bg-gray-50"></div>);
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const deliveriesForDay = deliveriesByDay.get(dateStr);
            const hasDelivery = !!deliveriesForDay;
            const color = monthColors[month];
            cells.push(
                <div key={day} className={`border-r border-b p-1 h-24 flex flex-col relative transition-colors ${hasDelivery ? 'cursor-pointer hover:bg-sky-50' : ''}`} onClick={() => hasDelivery && onDayClick(deliveriesForDay)}>
                    <span className={`text-sm font-medium ${new Date().toDateString() === date.toDateString() ? 'bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
                    {hasDelivery && <div className={`mt-1 flex-grow overflow-hidden text-xs`}><div className={`w-full p-1 rounded-sm ${color.bg} text-white`}>{deliveriesForDay.length} entrega{deliveriesForDay.length > 1 ? 's' : ''}</div></div>}
                </div>
            );
        }
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 7 - (totalCells % 7);
        if (remainingCells < 7) for (let i = 0; i < remainingCells; i++) cells.push(<div key={`empty-end-${i}`} className="border-r border-b bg-gray-50"></div>);
        return <div className="grid grid-cols-7">{cells}</div>;
    };

    return <div className="bg-white rounded-lg shadow-md">{renderHeader()}{renderDays()}{renderCells()}</div>;
};

const TableView = ({ records, setRecords, onUpdate, onUndo, onDownload, isEditingEnabled, setIsEditingEnabled, hasChanges, canUndo }) => {
    const handleCellChange = (e, rowIndex, columnId) => {
        const newValue = e.target.innerText;
        const updatedRecords = records.map((row, i) => i === rowIndex ? { ...row, [columnId]: newValue } : row);
        setRecords(updatedRecords);
    };

    const columns = [
        { id: 'FECHA DE ENTREGA', name: 'Fecha Entrega' }, { id: 'CANTIDAD', name: 'Cantidad' }, { id: 'CEPA', name: 'Cepa' },
        { id: 'SEXO', name: 'Sexo' }, { id: 'SEMANAS', name: 'Semanas' }, { id: 'PESO', name: 'Peso' },
        { id: 'CLIENTE', name: 'Cliente' }, { id: 'RECIBE', name: 'Recibe' }, { id: 'STATUS', name: 'Status' },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
                 <button onClick={() => setIsEditingEnabled(!isEditingEnabled)} className={`flex items-center gap-2 px-3 py-2 text-sm text-white rounded-md transition-colors ${isEditingEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
                     <Edit size={16} /> {isEditingEnabled ? 'Deshabilitar Edición' : 'Habilitar Edición'}
                 </button>
                 <button onClick={onUndo} disabled={!canUndo} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                     <Undo size={16} /> Deshacer
                 </button>
                 <button onClick={onUpdate} disabled={!hasChanges} className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
                     <Save size={16} /> Actualizar
                 </button>
                 <button onClick={onDownload} disabled={!hasChanges} className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed">
                     <Download size={16} /> Descargar
                 </button>
            </div>
            {/* The container div no longer needs overflow-x-auto */}
            <div className="w-full">
                {/* The table now has w-full and table-auto for responsive column sizing */}
                <table className="w-full table-auto bg-white">
                    <thead className="bg-gray-100"><tr>{columns.map(col => <th key={col.id} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{col.name}</th>)}</tr></thead>
                    <tbody>
                        {records.map((record, rowIndex) => {
                            const month = new Date(record['FECHA DE ENTREGA']).getMonth();
                            const color = monthColors[month];
                            return (
                                <tr key={record.id || rowIndex} className={`${rowIndex % 2 !== 0 ? 'bg-white' : color.lightBg} border-l-4 ${color.border}`}>
                                    {columns.map(col => (
                                        // Removed whitespace-nowrap and added break-words to allow text wrapping
                                        <td key={col.id} contentEditable={isEditingEnabled} suppressContentEditableWarning onBlur={(e) => handleCellChange(e, rowIndex, col.id)} className={`px-4 py-3 text-sm text-gray-800 break-words ${isEditingEnabled ? 'outline-none focus:bg-yellow-100 cursor-text' : 'cursor-default'}`}>
                                            {record[col.id] ?? ''}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function App() {
    const [originalRecords, setOriginalRecords] = useState([]);
    const [editedRecords, setEditedRecords] = useState([]);
    const [history, setHistory] = useState([]);
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [view, setView] = useState('calendar');
    const [modalInfo, setModalInfo] = useState({ deliveries: null, position: { x: 0, y: 0 } });
    const [isEditingEnabled, setIsEditingEnabled] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const data = dbData; // Carga desde el archivo simulado
        const dataWithIds = data.map((r, i) => ({ ...r, id: i }));
        setOriginalRecords(dataWithIds);
        setEditedRecords(dataWithIds);
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const dataWithIds = data.map((r, i) => ({ ...r, id: i }));
                    setOriginalRecords(dataWithIds);
                    setEditedRecords(dataWithIds);
                    setHistory([]);
                    setHasChanges(false);
                } catch (error) { alert("Error: El archivo JSON no es válido."); }
            };
            reader.readAsText(file);
        }
    };

    const handleDownloadJson = () => {
        const dataToSave = JSON.stringify(editedRecords.map(({ id, ...rest }) => rest), null, 2);
        const blob = new Blob([dataToSave], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DB.json';
        a.click();
        URL.revokeObjectURL(url);
        alert("Archivo DB.json descargado.");
    };

    const handleUpdateChanges = () => {
        setOriginalRecords(editedRecords);
        setHistory([]);
        setHasChanges(false);
        alert("Cambios actualizados en la aplicación.");
    };

    const updateEditedRecords = (newRecords) => {
        setHistory(prev => [...prev, editedRecords]);
        setEditedRecords(newRecords);
        setHasChanges(true);
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setEditedRecords(lastState);
            setHistory(prev => prev.slice(0, -1));
            // Check if we are back to the original state
            if (JSON.stringify(lastState) === JSON.stringify(originalRecords)) {
                setHasChanges(false);
            }
        }
    };

    const filteredRecords = useMemo(() => {
        if (filterStatus === 'Todos') return editedRecords;
        return editedRecords.filter(r => r.STATUS === filterStatus);
    }, [editedRecords, filterStatus]);

    const allStatus = useMemo(() => ['Todos', ...new Set(originalRecords.map(r => r.STATUS))], [originalRecords]);
    
    const handleDayClick = (deliveries) => {
        setModalInfo({ deliveries, position: { x: 0, y: 0 } });
    };

    const handleCloseModal = () => setModalInfo({ deliveries: null, position: { x: 0, y: 0 } });
    
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <style>{`.animate-fade-in { animation: fade-in 0.2s ease-out; } @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                         <div className="bg-gray-200 h-12 w-12 rounded-lg flex items-center justify-center"><span className="text-xs text-gray-500">Logo</span></div>
                         <h1 className="text-2xl font-bold text-gray-800">Calendario de entregas</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-700 text-sm">Filtrar por Status:</span>
                        <div className="flex rounded-md shadow-sm">
                            {allStatus.map(status => <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 text-sm first:rounded-l-md last:rounded-r-md border-y border-r first:border-l border-gray-300 transition-colors ${filterStatus === status ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 text-gray-700'}`}>{status}</button>)}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <input type="file" accept=".json" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                        <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"><Upload size={16} /> Cargar JSON</button>
                        <div className="flex rounded-md shadow-sm">
                            <button onClick={() => setView('table')} title="Vista de Tabla" className={`p-2 rounded-l-md transition-colors border border-gray-300 ${view === 'table' ? 'bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}><Table size={20} /></button>
                            <button onClick={() => setView('calendar')} title="Vista de Calendario" className={`p-2 rounded-r-md border-y border-r border-gray-300 transition-colors ${view === 'calendar' ? 'bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}><Calendar size={20} /></button>
                        </div>
                    </div>
                </div>
                <div>
                    {view === 'table' ? (
                        <TableView records={filteredRecords} setRecords={updateEditedRecords} onUpdate={handleUpdateChanges} onUndo={handleUndo} onDownload={handleDownloadJson} isEditingEnabled={isEditingEnabled} setIsEditingEnabled={setIsEditingEnabled} hasChanges={hasChanges} canUndo={history.length > 0} />
                    ) : (
                        <CalendarView records={filteredRecords} onDayClick={handleDayClick} />
                    )}
                </div>
            </main>
            <footer className="text-center py-4 mt-8"><p className="text-xs text-gray-500">Creado por Carlos Marin Aquino version de sistema 1.0.0.1 Beta</p></footer>
            {modalInfo.deliveries && <CalendarDayDetail deliveries={modalInfo.deliveries} onClose={handleCloseModal} />}
        </div>
    );
}
