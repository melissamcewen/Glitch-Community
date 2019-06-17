import React from 'react';

import { uploadAsset, uploadAssetSizes } from 'Utils/assets';
import { captureException } from 'Utils/sentry';
import { useNotifications } from 'State/notifications';

const NotifyUploading = ({ progress }) => (
  <>
    Uploading asset
    <progress value={progress} />
  </>
);
const NotifyError = ({ error }) => {
  if (error && error.status_code === 0) {
    return 'File upload failed. Check your firewall settings and try again?';
  }
  return 'File upload failed. Try again in a few minutes?';
};

async function uploadWrapper(notifications, upload) {
  let result = null;
  let progress = 0;
  const { updateNotification, removeNotification } = notifications.createNotification(<NotifyUploading progress={progress} />, {
    persistent: true,
  });
  try {
    result = await upload(({ lengthComputable, loaded, total }) => {
      if (lengthComputable) {
        progress = loaded / total;
      } else {
        progress = (progress + 1) / 2;
      }
      updateNotification(<NotifyUploading progress={progress} />);
    });
  } catch (error) {
    captureException(error);
    notifications.createNotification(<NotifyError error={error} />, { type: 'error' });
    removeNotification();
    return result;
  }

  removeNotification();
  notifications.createNotification('Image uploaded!');
  return result;
}

const useUploader = () => {
  const notifications = useNotifications();
  return {
    uploadAsset: (blob, policy, key) => uploadWrapper(notifications, (cb) => uploadAsset(blob, policy, key, cb)),
    uploadAssetSizes: (blob, policy, sizes) => uploadWrapper(notifications, (cb) => uploadAssetSizes(blob, policy, sizes, cb)),
  };
};

export default useUploader;
