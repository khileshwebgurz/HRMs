import React from 'react';

const PermissionIcons = ({ type, currentValue, onChange, fieldId, formId, roleId }) => {
  const icons = [
    { id: 1, title: "no-data", src: "/icons/no-data.png" },
    { id: 2, title: "my-data", src: "/icons/my-data.png" },
    { id: 3, title: "reporties-data", src: "/icons/reporties-data.png" },
    { id: 4, title: "reporties+my-data", src: "/icons/reporties-my-data.png" },
    { id: 5, title: "all-data", src: "/icons/all-data.png" }
  ];

  const handleClick = (value) => {
    if (onChange) {
      onChange(type, value, fieldId, formId, roleId);
    }
  };

  return (
    <div className="dropdown roles-dropdown">
      <a 
        title={icons.find(i => i.id === currentValue)?.title || "no-data"} 
        href="#" 
        role="button" 
        id="dropdownMenuLink" 
        data-toggle="dropdown" 
        aria-haspopup="true" 
        aria-expanded="false"
      >
        <img 
          src={icons.find(i => i.id === currentValue)?.src || "/icons/no-data.png"} 
          alt="" 
        />
      </a>
      
      <div className="dropdown-menu roles-list" aria-labelledby="dropdownMenuLink">
        {icons.map(icon => (
          <a 
            key={icon.id}
            className="dropdown-item" 
            title={icon.title}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick(icon.id);
            }}
          >
            <img src={icon.src} alt="" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default PermissionIcons;