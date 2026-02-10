import React from 'react';
import Swal from 'sweetalert2';
import Theme from '../../config/theam/index.js';

const LogoutConfirmation = ({ onConfirm, userRole = 'user', children }) => {
  const roleMap = {
    admin: {
      title: 'Admin Logout',
      subtitle: 'Admin Panel',
      message: 'Are you sure you want to logout?.',
      confirmText: 'Yes, Logout',
      icon: '👨‍💼'
    },
    labtechnician: {
      title: 'Lab Technician Logout',
      subtitle: 'Lab Technician Portal',
      message: 'Are you sure you want to logout?',
      confirmText: 'Yes, Logout',
      icon: '👩‍⚕️'
    },
    default: {
      title: 'User Logout',
      subtitle: 'Patient Portal',
      message: 'Are you sure you want to logout?',
      confirmText: 'Yes, Logout',
      icon: '👤'
    }
  };

  const getRoleSpecificContent = () => roleMap[userRole] || roleMap.default;

  const showLogoutConfirmation = () => {
    const { title, subtitle, message, confirmText, icon } = getRoleSpecificContent();

    const minimalStyles = `
      <style>
        .logout-popup { border-radius:16px; max-width:480px; padding:20px; text-align:center; box-shadow:0 12px 30px rgba(0,0,0,0.12); }
        .logout-icon{width:64px;height:64px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin:12px auto;font-size:28px;background:linear-gradient(135deg, ${Theme.colors.secondary}20, ${Theme.colors.primary}20);}
        .logout-title{margin:8px 0 4px;color:${Theme.colors.textDark};font-weight:700;font-size:20px}
        .logout-sub{margin:0 0 8px;color:${Theme.colors.textPrimary}} .logout-msg{color:${Theme.colors.textMuted};margin-bottom:16px}
        .swal2-container{z-index:9999}
      </style>
    `;

    Swal.fire({
      title: '',
      html: `${minimalStyles}<div class="logout-popup"><h2 class="logout-title">${title}</h2><div class="logout-icon">${icon}</div><h3 class="logout-sub">${subtitle}</h3><p class="logout-msg">${message}</p></div>`,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: {
        popup: 'logout-popup'
      },
      showClass: { popup: 'swal2-show' },
      hideClass: { popup: 'swal2-hide' }
    }).then((res) => {
      if (res.isConfirmed) onConfirm();
    });
  };

  return <div onClick={showLogoutConfirmation}>{children}</div>;
};

export default LogoutConfirmation;
