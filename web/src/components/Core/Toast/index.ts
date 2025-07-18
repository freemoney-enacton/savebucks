'use client';
import { Bounce, toast } from 'react-toastify';

export const Toast = {
  errorTop: (msg: string | undefined) => {
    toast.error(msg, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  errorBottom: (msg: string | undefined) => {
    toast.error(msg, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  errorBottomRight: (msg: string | undefined) => {
    toast.error(msg, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  error: (msg: string) => {
    toast.error(msg, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  showTop: (msg: string) => {
    toast.info(msg, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  showBottom: (msg: string) => {
    toast.info(msg, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },

  show: (msg: string) => {
    toast.info(msg, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  successTop: (msg: string) => {
    toast.success(msg, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  successBottom: (msg: string) => {
    toast.success(msg, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  success: (msg: string) => {
    toast.success(msg, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  warnTop: (msg: string) => {
    toast.warning(msg, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  warnBottom: (msg: string) => {
    toast.warning(msg, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
      toastId: msg,
    });
  },
  warn: (msg: string) => {
    toast.warning(msg, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
      toastId: msg,
    });
  },
  //   exitApp: (msg: string) => {
  //     ToastComponent.show({
  //       type: 'info',
  //       position: 'bottom',
  //       text1: 'Info',
  //       text2: msg,
  //       visibilityTime: 4000,
  //       autoHide: true,
  //       topOffset: 30,
  //       bottomOffset: 40,
  //     });
  //   },
};
