import React from 'react';
import Theme from '../../config/theam/index.js';

export default function SidebarDropdown({ 
  label, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  items, 
  activeTab, 
  setActiveTab,
  ChevronRight 
}) {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-xl transition-all duration-300 group ${
          isOpen
            ? "text-white shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primaryHover"
            : "text-gray-600 hover:bg-gray-50/80 hover:shadow-md hover:translate-x-1 active:scale-95"
        }`}
      >
        <div className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl transition-all duration-300 ${
          isOpen
            ? 'bg-white/20 backdrop-blur-sm'
            : 'bg-gray-100 group-hover:bg-gray-200 group-active:scale-95'
        }`}>
          <Icon size={20} className={`${isOpen ? 'text-white' : `text-[${Theme.colors.primary}] group-hover:text-[${Theme.colors.primary}]`} transition-colors duration-200`} />
        </div>
        <span className="font-semibold flex-1 text-left text-sm md:text-base">{label}</span>
        {ChevronRight && (
          isOpen ? (
            <ChevronRight size={16} className="text-white animate-pulse hidden md:block transform rotate-90" />
          ) : (
            <ChevronRight size={16} className={`text-[${Theme.colors.primary}] group-hover:text-[${Theme.colors.primary}] hidden md:block`} />
          )
        )}
      </button>
      
      {isOpen && (
        <div className="ml-4 md:ml-8 mt-2 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.onItemClick) {
                  item.onItemClick(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 md:px-5 md:py-3 rounded-lg transition-all duration-300 group ${
                activeTab === item.id
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 active:scale-95"
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-primary/20'
                  : 'bg-gray-100 group-hover:bg-gray-200 group-active:scale-95'
              }`}>
                <item.icon size={16} className={`${activeTab === item.id ? 'text-primary' : `text-[${Theme.colors.primary}] group-hover:text-[${Theme.colors.primary}]`} transition-colors duration-200`} />
              </div>
              <span className="font-medium text-left text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
