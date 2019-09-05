import { useNotifications } from 'State/notifications';

function handleError(notify, error) {
  console.error(error);
  notify();
  return Promise.reject(error);
}

function handleErrorForInput(notify, error) {
  if (!(error && error.response && error.response.data)) {
    return handleError(notify, error);
  }
  return Promise.reject(error);
}

function handleCustomError(notify, error) {
  console.error(error);
  if (error && error.response && error.response.data) {
    notify(error.response.data.message);
  }
  return Promise.reject(error);
}

function handleImageUploadError(notify, error) {
  console.error(error);
  notify('Unable to process image. Please try another image.');
  // swallow the error
  return false;
}

const useErrorHandlers = () => {
  const { createErrorNotification } = useNotifications();
  return {
    handleError: (error) => handleError(createErrorNotification, error),
    handleErrorForInput: (error) => handleErrorForInput(createErrorNotification, error),
    handleCustomError: (error) => handleCustomError(createErrorNotification, error),
    handleImageUploadError: (error) => handleImageUploadError(createErrorNotification, error),
  };
};

export default useErrorHandlers;
