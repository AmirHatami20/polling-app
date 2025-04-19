import React from 'react';

function TreadingPolls({stats}) {
    return (
        <div className="bg-slate-100/50 mt-6 overflow-hidden sticky top-[80px] p-5">
            <h6 className="text-sm text-black font-medium">آمار و ارقام</h6>
            <div className="mt-4">
                {stats.map((item, index) => (
                    <div className="flex items-center justify-between rounded-lg cursor-pointer mb-1 px-3 py-2 hover:bg-slate-300/30" key={index}>
                        <p className="text-xs text-slate-900">{item.label}</p>
                        <span className="text-xs text-slate-600 rounded py-0.5 px-4">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TreadingPolls;