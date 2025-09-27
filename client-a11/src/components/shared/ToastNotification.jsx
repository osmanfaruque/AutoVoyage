import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const swalConfig = {
  timer: 2500,
  timerProgressBar: true,
  showConfirmButton: false,
  position: 'center',
  customClass: {
    popup: 'swal2-popup-custom',
    container: 'swal2-container-custom'
  }
};

export const notifyPasswordResetSent = () => {
  return MySwal.fire({
    ...swalConfig,
    icon: 'success',
    title: "Password reset email sent! Please check your inbox.",
  });
};

export const notifyError = (message) => {
  return MySwal.fire({
    ...swalConfig,
    icon: 'error',
    title: message || "An error occurred.",
  });
};

export const notifySuccess = (message, { animation } = {}) => {
  const config = { ...swalConfig };

  if (animation) {
    config.html = animation;
    config.title = message;
  } else {
    config.icon = 'success';
    config.title = message || "Success!";
  }

  return MySwal.fire(config);
} 