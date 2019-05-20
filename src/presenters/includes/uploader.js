import React from 'react';

import { uploadAsset, uploadAssetSizes } from 'Utils/assets';
import { useNotifications } from 'State/notifications';

const NotifyUploading = ({ progress }) => (
  <>
    Uploading asset
    <progress className="notify-progress" value={progress} />
  </>
);
const NotifyError = () => 'File upload failed. Try again in a few minutes?';

async function uploadWrapper(notifications, upload) {
  let result = null;
  let progress = 0;
  const { updateNotification, removeNotification } = notifications.createPersistentNotification(
    <NotifyUploading progress={progress} />,
    'notifyUploading',
  );
  try {
    result = await upload(({ lengthComputable, loaded, total }) => {
      if (lengthComputable) {
        progress = loaded / total;
      } else {
        progress = (progress + 1) / 2;
      }
      updateNotification(<NotifyUploading progress={progress} />);
    });
  } catch (e) {
    notifications.createErrorNotification(<NotifyError />);
    throw e;
  } finally {
    removeNotification();
    notifications.createNotification('Image uploaded!');
  }
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
