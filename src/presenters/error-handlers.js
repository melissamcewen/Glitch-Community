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

const useErrorHandlers = () => {
  const { createErrorNotification } = useNotifications();
  return {
    handleError: (error) => handleError(createErrorNotification, error),
    handleErrorForInput: (error) => handleErrorForInput(createErrorNotification, error),
    handleCustomError: (error) => handleCustomError(createErrorNotification, error),
  };
};

export default useErrorHandlers;
